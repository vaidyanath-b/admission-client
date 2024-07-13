"use client"
import React, { useEffect } from "react";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Card, CardBody } from "@nextui-org/card";
import PersonalDetailsForm from './PersonalDetailsForm';
import ParentDetailsForm from './ParentDetailsForm';
import AddressesForm from './AddressesForm';
import PreviousInstitutionForm from './PreviousInstitutionForm';
import ExaminationDetailsForm from './ExaminationDetailsForm';
import BankDetailsForm from './BankDetailsForm';
import DocumentUploadForm from './DocumentUploadForm';
import { ApplicantDetailsContext } from "@/context/applicantDetails/context";

export default function App() {
  const [selected, setSelected] = React.useState<any>("personal-details");
  const context = React.useContext(ApplicantDetailsContext);
  if (!context) {
    throw new Error("useApplicantDetails must be used within an ApplicantDetailsContext");
  }
  const {applicationLoading} = context
  const setTab = (tab: string) => {
    return function () {
      setSelected(tab);
    };
  };



  return (
    !applicationLoading?
    <div className="flex flex-col w-full items-center">
      <Card className="max-w-full w-[1000px] h-auto p-2">
        <CardBody className="overflow-hidden">
          <Tabs
            fullWidth
            size="lg"
            aria-label="Tabs form"
            selectedKey={selected}
            onSelectionChange={setSelected}
          >
            <Tab key="personal-details" title="Personal Details">
              <PersonalDetailsForm  setTab={setTab("parent-details")}/>
            </Tab>
            <Tab key="parent-details" title="Parent Details">
              <ParentDetailsForm setTab={setTab("addresses")}/>
            </Tab>
            <Tab key="addresses" title="Addresses">
              <AddressesForm  setTab={setTab("previous-institution")}/>
            </Tab>
            <Tab key="previous-institution" title="Previous Institution">
              <PreviousInstitutionForm setTab={setTab("examination-details")}/>
            </Tab>
            <Tab key="examination-details" title="Examination Details">
              <ExaminationDetailsForm setTab={setTab("bank-details")}/>
            </Tab>
            <Tab key="bank-details" title="Bank Details">
              <BankDetailsForm setTab={setTab("document-upload")}/>
            </Tab>
            <Tab key="document-upload" title="Documents">
                <DocumentUploadForm />  
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
    :(
      <div className="flex flex-col w-full items-center">
        <Card className="max-w-full w-[1000px] h-auto p-2">
          <CardBody className="overflow-hidden">
            <h1>Loading</h1>
          </CardBody>
        </Card>
      </div>
    )
  )
  ;
}
