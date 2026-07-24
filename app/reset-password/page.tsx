import type { Metadata } from "next"
import Link from "next/link"
import { SetPasswordForm } from "@/components/auth/set-password-form"

export const metadata: Metadata = {
  title: "Reset Password | Productivity Timesheet",
  description: "Reset your Productivity Timesheet password",
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>
          <p className="text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        {/* Form */}
        <SetPasswordForm mode="reset" />

        {/* Footer */}
        <div className="text-center text-sm">
          <Link href="/login" className="font-medium underline underline-offset-4 hover:text-primary">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
