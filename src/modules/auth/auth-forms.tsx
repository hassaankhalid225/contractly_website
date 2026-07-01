"use client";
import Link from "next/link";
import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/forms/submit-button";
import { signupAction, loginAction, demoGoogleAction, type ActionState } from "./actions";

const initial: ActionState = {};

function GoogleButton() {
  return (
    <form action={demoGoogleAction}>
      <Button type="submit" variant="outline" size="lg" className="w-full">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M22.5 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-2 3.2-4.9 3.2-7.8Z" />
          <path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.7c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23Z" />
          <path fill="#FBBC05" d="M6 14.4a6.6 6.6 0 0 1 0-4.2V7.4H2.3a11 11 0 0 0 0 9.8L6 14.4Z" />
          <path fill="#EA4335" d="M12 5.5c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 2.3 7.4L6 10.2C6.9 7.7 9.2 5.5 12 5.5Z" />
        </svg>
        Continue with Google
      </Button>
    </form>
  );
}

function Divider() {
  return (
    <div className="my-4 flex items-center gap-3 text-xs text-ink-secondary">
      <span className="h-px flex-1 bg-black/10" /> or <span className="h-px flex-1 bg-black/10" />
    </div>
  );
}

export function SignupForm() {
  const [state, action] = useFormState(signupAction, initial);
  return (
    <div className="space-y-1">
      <GoogleButton />
      <Divider />
      <form action={action} className="space-y-3">
        <Input name="name" label="Name" required placeholder="Hamza Khan" autoComplete="name" />
        <Input name="email" type="email" label="Email" required placeholder="you@email.com" autoComplete="email" />
        <Input name="password" type="password" label="Password" required placeholder="At least 8 characters" autoComplete="new-password" hint="Minimum 8 characters" />
        <label className="flex items-start gap-2 text-xs text-ink-secondary">
          <input type="checkbox" required className="mt-0.5" />
          <span>I agree to the Terms of Service and Privacy Policy.</span>
        </label>
        {state.error && <p className="text-sm text-error">{state.error}</p>}
        <SubmitButton size="lg" className="w-full">Create free account</SubmitButton>
      </form>
      <p className="pt-2 text-center text-sm text-ink-secondary">
        Already have an account? <Link href="/login" className="font-medium text-primary">Log in</Link>
      </p>
    </div>
  );
}

export function LoginForm() {
  const [state, action] = useFormState(loginAction, initial);
  return (
    <div className="space-y-1">
      <GoogleButton />
      <Divider />
      <form action={action} className="space-y-3">
        <Input name="email" type="email" label="Email" required placeholder="you@email.com" autoComplete="email" />
        <Input name="password" type="password" label="Password" required autoComplete="current-password" />
        {state.error && <p className="text-sm text-error">{state.error}</p>}
        <SubmitButton size="lg" className="w-full">Log in</SubmitButton>
      </form>
      <p className="pt-2 text-center text-sm text-ink-secondary">
        New to Contractly? <Link href="/signup" className="font-medium text-primary">Start free</Link>
      </p>
      <p className="text-center text-xs text-ink-secondary">
        Demo login: hamza@demo.contractly.app / password123
      </p>
    </div>
  );
}
