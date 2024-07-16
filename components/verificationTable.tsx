"use client"
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Tooltip,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import DocumentVerificationModal from "./DocumentVerification"; // Adjust the path as necessary
import axios from "axios";
import { apiUrl } from "@/lib/env";
import getUserSession from "@/lib/actions";

interface Allotment {
  course: string;
  quota: string;
  allotmentMemoLink: string;
  verified: boolean;
}

interface DocumentUpdate {
  verification: boolean;
  phaseId: number;
  remarks: string;
}

interface Document {
  documentTypeCode: string;
  DocumentUpdate: DocumentUpdate[];
  filename:string | null;
}

interface Applicant {
  id: number;
  firstName:string;
  lastName:string;
  currentPhaseId: number;
  Allotment: Allotment[];
  Document: Document[];
}

interface PhaseDocument {
  phaseId: number;
  documentTypeCode: string;
}

const getApplicantsWithPhaseStatus = async (): Promise<{ phaseDocuments: PhaseDocument[], applicantsData: Applicant[] }> => {
  const datal = {
    phaseDocuments: 
    [
      { phaseId: 1, documentTypeCode: "DOC001" },
      { phaseId: 1, documentTypeCode: "DOC002" },
      { phaseId: 2, documentTypeCode: "DOC003" },
      { phaseId: 2, documentTypeCode: "DOC004" }
    ],
    applicantsData: [
      {
        id: 1,
        currentPhaseId: 2,
        Allotment: [
          {
            course: "Computer Science",
            quota: "GENERAL",
            allotmentMemoLink: "https://example.com/memo1",
            verified: true
          }
        ],
        Document: [
          {
            filename:"/1234/nice",
            documentTypeCode: "DOC001",
            DocumentUpdate: [
              { verification: false, phaseId: 1,remarks:"" },
              { verification: true, phaseId: 2,remarks:"" }
            ]
          },
          {
            filename:"/1234/nice",
            documentTypeCode: "DOC002",
            DocumentUpdate: [
              { verification: true, phaseId: 1,remarks:"" }
            ]
          }
        ]
      },
      {
        id: 2,
        currentPhaseId: 1,
        Allotment: [
          {
            course: "Electrical Engineering",
            quota: "SC",
            allotmentMemoLink: "https://example.com/memo2",
            verified: false
          }
        ],
        Document: []
      },
      {
        id: 3,
        currentPhaseId: 2,
        Allotment: [
          {
            course: "Mechanical Engineering",
            quota: "ST",
            allotmentMemoLink: "https://example.com/memo3",
            verified: true
          }
        ],
        Document: [
          {
            filename:"/1234/nice",
            documentTypeCode: "DOC001",
            DocumentUpdate: [
              { verification: true, phaseId: 1,remarks:"" },
              { verification: true, phaseId: 2,remarks:"" }
            ]
          },
          {
            filename:"/1234/nice",
            documentTypeCode: "DOC002",
            DocumentUpdate: [
              { verification: true, phaseId: 1,remarks:"" }
            ]
          },
          {
            filename:"/1234/nice",
            documentTypeCode: "DOC003",
            DocumentUpdate: [
              { verification: true, phaseId: 2,remarks:"" }
            ]
          }
        ]
      }
    ]
  };
  const {accessToken} = await getUserSession(); 
  const data = await axios.get(`${apiUrl}/api/admin/verification-list`,{
    headers:{Authorization: `Bearer ${accessToken || ""}`,
    "Content-Type": "application/json",
  }
  })
  return data.data;
};

const statusColorMap: { [key: string]: "success" | "danger" | "warning" | "default" } = {
  verified: "success",
  unverified: "danger",
  pending: "warning",
  notsubmitted: "default",
};

const quotaColorMap: { [key: string]: "primary" | "warning" | "danger" } = {
  GENERAL: "primary",
  SC: "warning",
  ST: "danger",
};

const ApplicantTable = ({phaseDocuments}:{phaseDocuments:PhaseDocument[]}) => {
  if(!phaseDocuments || !phaseDocuments.length){
    return <>

    </>
  }
  const [loading , setLoading] = useState(true);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    async function fetchData() {
      const data = await getApplicantsWithPhaseStatus();
      console.log("phase", data);
      setApplicants(data.applicantsData);
      setLoading(false)
    }
    fetchData();
  }, []);

  const columns = [
    { name: "Applicant ID", uid: "id" },
    { name: "Branch/Course", uid: "course" },
    { name: "Quota", uid: "quota" },
    ...phaseDocuments.map(doc => ({
      name: doc.documentTypeCode,
      uid: doc.documentTypeCode,
    })),
    { name: "Actions", uid: "actions" },
  ];

  const renderCell = (applicant: Applicant, columnKey: string) => {
    switch (columnKey) {
      case "id":
        return <div>{applicant.id}</div>;
      case "course":
        return <div>{applicant.Allotment[0]?.course || "N/A"}</div>;
      case "quota":
        return (
          <Chip
            color={quotaColorMap[applicant.Allotment[0]?.quota]}
            size="sm"
            variant="flat"
          >
            {applicant.Allotment[0]?.quota || "N/A"}
          </Chip>
        );
      case "actions":
        return (
          <Tooltip content="Verify Documents">
            <Button
              isIconOnly
              color="primary"
              variant="light"
              onPress={() => handleVerify(applicant)}
            >
              <FaEye />
            </Button>
          </Tooltip>
        );
      default:
        const document = applicant.Document.find(
          doc => doc.documentTypeCode === columnKey
        );
        const status = document?.DocumentUpdate.find(
          update => update.phaseId === 1
        )?.verification;
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[status ? "verified" : "unverified"]}
            size="sm"
            variant="flat"
          >
            {!document ? "N/S" : status ? "Verified" : "Unverified"}
          </Chip>
        );
    }
  };

  const handleVerify = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    onOpen();
  };

  return (
    loading ? <Spinner/>:
    <>
      {selectedApplicant && (
        <DocumentVerificationModal
          setApplicant={setApplicants}
          applicant={selectedApplicant}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          phaseDocuments={phaseDocuments}
        />
      )}
      <Table aria-label="Applicant document verification status">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={applicants}>
          {(applicant) => (
            <TableRow key={applicant.id}>
              {(columnKey) => (
                <TableCell>{renderCell(applicant, String(columnKey))}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default ApplicantTable;
