import "@/styles/globals.css";
import React from "react";
import AdminState from "@/context/admin/state";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <AdminState>
              {children}
              {/* Footer content */}
        </AdminState>
  );
}