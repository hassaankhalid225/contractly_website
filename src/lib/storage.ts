import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { features, env } from "./env";

/**
 * File storage adapter. Uses S3/R2 when configured, otherwise persists to a
 * local `.storage` directory so uploads work with zero infra in development.
 *
 * The S3 path uses a lazy dynamic import so the optional `@aws-sdk` dependency
 * is only required when storage credentials are actually present.
 */

const LOCAL_DIR = path.join(process.cwd(), ".storage");

export type StoredFile = { key: string; url: string };

export async function putFile(key: string, data: Buffer, contentType: string): Promise<StoredFile> {
  if (features.storage) {
    return putS3(key, data, contentType);
  }
  const full = path.join(LOCAL_DIR, key);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, data);
  return { key, url: `/api/files/${key}` };
}

export async function getFile(key: string): Promise<{ data: Buffer; contentType: string } | null> {
  if (features.storage) {
    return getS3(key);
  }
  try {
    const full = path.join(LOCAL_DIR, key);
    const data = await fs.readFile(full);
    return { data, contentType: guessMime(key) };
  } catch {
    return null;
  }
}

function guessMime(key: string) {
  if (key.endsWith(".pdf")) return "application/pdf";
  if (key.endsWith(".png")) return "image/png";
  if (key.endsWith(".jpg") || key.endsWith(".jpeg")) return "image/jpeg";
  if (key.endsWith(".docx"))
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  return "application/octet-stream";
}

// ── S3 / R2 backend (only loaded when configured) ──────────────────────────
// `@aws-sdk/client-s3` is an OPTIONAL dependency: install it only when using
// cloud storage. We import it through a runtime indirection so the bundler does
// not statically resolve it (which would fail the build when it's absent).
const importOptional: (name: string) => Promise<any> = new Function(
  "name",
  "return import(name)",
) as never;

async function s3Client() {
  const { S3Client } = await importOptional("@aws-sdk/client-s3");
  return new S3Client({
    region: env.STORAGE_REGION,
    endpoint: env.STORAGE_ENDPOINT,
    credentials: {
      accessKeyId: env.STORAGE_ACCESS_KEY_ID!,
      secretAccessKey: env.STORAGE_SECRET_ACCESS_KEY!,
    },
  });
}

async function putS3(key: string, data: Buffer, contentType: string): Promise<StoredFile> {
  const { PutObjectCommand } = await importOptional("@aws-sdk/client-s3");
  const client = await s3Client();
  await client.send(
    new PutObjectCommand({ Bucket: env.STORAGE_BUCKET!, Key: key, Body: data, ContentType: contentType }),
  );
  return { key, url: `/api/files/${key}` };
}

async function getS3(key: string) {
  const { GetObjectCommand } = await importOptional("@aws-sdk/client-s3");
  const client = await s3Client();
  const res = await client.send(new GetObjectCommand({ Bucket: env.STORAGE_BUCKET!, Key: key }));
  const bytes = await res.Body!.transformToByteArray();
  return { data: Buffer.from(bytes), contentType: res.ContentType ?? guessMime(key) };
}
