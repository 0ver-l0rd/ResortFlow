import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] p-4">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-cyan-500/10 blur-3xl" />
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "bg-gradient-to-r from-cyan-600 to-purple-600 hover:opacity-90 transition-opacity",
            card: "bg-[#0f0f1a] border border-[#1e1e2e]",
            headerTitle: "text-white",
            headerSubtitle: "text-slate-400",
            socialButtonsBlockButton: "bg-[#1e1e2e] border border-[#334155] text-white hover:bg-[#252535]",
            footerActionLink: "text-cyan-400 hover:text-cyan-300",
            dividerLine: "bg-[#1e1e2e]",
            dividerText: "text-slate-500",
            formFieldLabel: "text-slate-300",
            formFieldInput: "bg-[#0a0a0f] border-[#1e1e2e] text-white",
          }
        }}
      />
    </div>
  );
}
