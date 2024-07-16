"use client"
import React, { useContext, useState } from "react";
import VerificationList from "@/components/verificationTable";
import { Tabs, Tab } from "@nextui-org/react";
import { MetaContext } from "@/context/metaContext/context";

export default function Page() {
  const context = useContext(MetaContext);
  if (!context) {
    throw new Error("context use inside provider");
  }
  const { phaseDocuments } = context;
  const uniquePhases = [...new Set(phaseDocuments.map((P) => P.phaseId))];
  const [selectedPhase, setSelectedPhase] = useState<any>(uniquePhases[0]);
  return (
    <div>
          <Tabs
            fullWidth
            size="lg"
            aria-label="Tabs form"
            selectedKey={selectedPhase}
            onSelectionChange={setSelectedPhase}
          >        {uniquePhases.map((phaseId) => (
          <Tab key={phaseId} value={phaseId} title={`Phase ${phaseId}`}>     
          </Tab>
        ))}
      </Tabs>
      <VerificationList phaseDocuments={phaseDocuments.filter(doc=>doc.phaseId==selectedPhase)} />
    </div>
  );
}
