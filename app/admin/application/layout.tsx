import "@/styles/globals.css";
import React from "react";
import AdminApplicantState from "@/context/adminApplicantDetails/state";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <AdminApplicantState>
              {children}
              {/* Footer content */}
        </AdminApplicantState>
  );
}