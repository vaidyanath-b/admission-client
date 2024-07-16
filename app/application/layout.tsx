import "@/styles/globals.css";
import React from "react";
import ApplicationState from "@/context/applicantDetails/state";

export default function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <ApplicationState>
              {children}
              {/* Footer content */}
        </ApplicationState>
  );
}