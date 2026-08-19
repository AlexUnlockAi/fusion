import Image from "next/image";
import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/images/logo.png"
            alt="Adinkra Fusion Kitchen"
            width={56}
            height={56}
            className="rounded-full"
          />
          <h1 className="mt-4 font-heading text-2xl font-medium">
            Adinkra Fusion Kitchen
          </h1>
          <p className="text-sm text-muted-foreground">Order & CRM Portal</p>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card p-7 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
