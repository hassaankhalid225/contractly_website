// The S3/R2 storage driver lazy-imports @aws-sdk/client-s3 only when storage
// credentials are configured. It's an optional peer dependency — install it
// (`npm i @aws-sdk/client-s3`) when enabling cloud storage. This shim keeps the
// type-checker happy when the package isn't installed.
declare module "@aws-sdk/client-s3";
