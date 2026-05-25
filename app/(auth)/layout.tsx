import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f6f9fc] py-12 px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
