"use client"
import React, { useState, useEffect } from "react";
import { Modal, Button, Chip, ModalContent } from "@nextui-org/react";
import { createClient } from "@/lib/supabase/client";
import { apiUrl } from "@/lib/env";
import axios from "axios";
import getUserSession from "@/lib/actions";

interface Applicant {
  id: number;
  currentPhaseId: number;
  Allotment: {
    course: string;
    quota: string;
    allotmentMemoLink: string;
    verified: boolean;
  }[];
  Document: {
    documentTypeCode: string;
    fileName: string | null;
    DocumentUpdate: {
      verification: boolean;
      remarks: string;
      phaseId: number;
    }[];
  }[];
}

interface PhaseDocument {
  phaseId: number;
  documentTypeCode: string;
}

interface DocumentVerificationModalProps {
  setApplicant: React.Dispatch<React.SetStateAction<Applicant[]>>
  applicant: Applicant;
  phaseDocuments: PhaseDocument[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

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

async function downloadFile(filePath: string): Promise<string | null> {
  const bucketName = "admission";
  try {
    const supabase = createClient();
    const { data: d, error: e } = await supabase.storage
      .from(bucketName)
      .list();

    console.log("Files in bucket:", d);

    console.log("Downloading file", filePath, bucketName);
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (error) {
      throw error;
    }

    if (data) {
      return URL.createObjectURL(data);
    }
  } catch (error) {
    console.error("Error downloading file:", error);
  }
  console.log("Error downloading file");
  return null;
}

const DocumentVerificationModal: React.FC<DocumentVerificationModalProps> = ({ applicant, phaseDocuments, isOpen, onOpenChange, setApplicant }) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});
  const [statuses, setStatuses] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const initialStatuses: { [key: string]: string } = {};
    phaseDocuments.forEach((phaseDocument) => {
      const document = applicant.Document.find(doc => doc.documentTypeCode === phaseDocument.documentTypeCode);
      let status = "notsubmitted";
      if (document) {
        const documentUpdate = document.DocumentUpdate.find(update => update.phaseId === phaseDocument.phaseId);
        status = documentUpdate ? (documentUpdate.verification ? "verified" : "unverified") : "pending";
      }
      initialStatuses[phaseDocument.documentTypeCode] = status;
    });
    setStatuses(initialStatuses);
  }, [applicant, phaseDocuments]);

  const handleViewImage = async (filePath: string) => {
    const url = await downloadFile(filePath);
    if (url) {
      setImageURL(url);
      setImageModalOpen(true);
    }
  };

  const handleRemarkChange = (documentTypeCode: string, value: string) => {
    setRemarks(prevRemarks => ({ ...prevRemarks, [documentTypeCode]: value }));
  };

  async function updateDocumentVerification(
    applicantId: number,
    documentTypeCode: string,
    phaseId: number,
    verification: boolean,
    remark?: string
  ): Promise<void> {
    try {
      // Simulating API call
      console.log(`Updating document verification: ${documentTypeCode}, Verification: ${verification}, Remark: ${remark}`);

      // Replace with actual API call using axios
      const { accessToken } = await getUserSession();
      const response = await axios.post(`${apiUrl}/api/document/verification`, {
        applicantId,
        documentTypeCode,
        phaseId,
        verification,
        remark
      },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        },
      );

      if (response.status !== 200) {
        return alert('Failed to update document verification');
      }

      // Simulating success
      console.log('Document verification updated successfully');

      // Update state locally after API success
      setApplicant((prevApplicants) =>
        prevApplicants.map((applicant) => {
          if (applicant.id !== applicantId) return applicant;
      
          const updatedDocuments = applicant.Document.map((document) => {
            if (document.documentTypeCode !== documentTypeCode) return document;
      
            const updatedUpdates = document.DocumentUpdate.some((update) => update.phaseId === phaseId)
              ? document.DocumentUpdate.map((update) =>
                  update.phaseId === phaseId ? { ...update, verification, remarks: remark || update.remarks } : update
                )
              : [
                  ...document.DocumentUpdate,
                  { verification, remarks: remark || '', phaseId },
                ];
      
            return { ...document, DocumentUpdate: updatedUpdates };
          });
      
          return { ...applicant, Document: updatedDocuments };
        })
      );
      
      setStatuses(prevStatuses => ({
        ...prevStatuses,
        [documentTypeCode]: verification ? "verified" : "unverified"
      }));
    } catch (error) {
      console.error('Error updating document verification:', error);
    }
  }

  const handleAccept = async (phaseDocument: PhaseDocument) => {
    const documentTypeCode = phaseDocument.documentTypeCode;
    const applicantId = applicant.id;
    const phaseId = phaseDocument.phaseId;
    const remark = remarks[documentTypeCode] || '';

    console.log(`Accepting document: ${documentTypeCode}, Remarks: ${remark}`);
    await updateDocumentVerification(applicantId, documentTypeCode, phaseId, true, remark);
    console.log(`Accepted document: ${documentTypeCode}, Remarks: ${remark}`);
  };

  const handleReject = async (phaseDocument: PhaseDocument) => {
    const documentTypeCode = phaseDocument.documentTypeCode;
    const applicantId = applicant.id;
    const phaseId = phaseDocument.phaseId;
    const remark = remarks[documentTypeCode] || '';

    console.log(`Rejecting document: ${documentTypeCode}, Remarks: ${remark}`);
    await updateDocumentVerification(applicantId, documentTypeCode, phaseId, false, remark);
    console.log(`Rejected document: ${documentTypeCode}, Remarks: ${remark}`);
  };

  if (!applicant) return null;

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="flex flex-col p-4">
        <ModalContent>
          {(onClose) => (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Verify Documents for Applicant {applicant.id}
                </h2>
                <Button color="danger" onPress={onClose}>
                  Close
                </Button>
              </div>
              <div className="mb-4">
                <p>Course: {applicant.Allotment[0]?.course || "N/A"}</p>
                <Chip color={quotaColorMap[applicant.Allotment[0]?.quota]} size="sm" variant="flat">
                  {applicant.Allotment[0]?.quota}
                </Chip>
              </div>

              {phaseDocuments.map((phaseDocument) => (
                <div key={phaseDocument.documentTypeCode} className="card mb-4 p-4 border rounded-lg flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p>Type: {phaseDocument.documentTypeCode}</p>
                      <Chip
                        color={statusColorMap[statuses[phaseDocument.documentTypeCode]]}
                        size="sm"
                        variant="flat"
                      >
                        {statuses[phaseDocument.documentTypeCode]?.charAt(0).toUpperCase() + statuses[phaseDocument.documentTypeCode]?.slice(1)}
                      </Chip>
                    </div>
                    <Button size="sm" onPress={() => handleViewImage(`${phaseDocument.documentTypeCode}.jpg`)}>
                      View
                    </Button>
                  </div>
                  <input
                    type="text"
                    placeholder="Add remarks"
                    value={remarks[phaseDocument.documentTypeCode] || ''}
                    onChange={(e) => handleRemarkChange(phaseDocument.documentTypeCode, e.target.value)}
                    className="mb-2 p-2 border rounded"
                  />
                  <div className="flex justify-end">
                    <Button size="sm" color="success" onPress={() => handleAccept(phaseDocument)} className="mr-2">
                      Accept
                    </Button>
                    <Button size="sm" color="danger" onPress={() => handleReject(phaseDocument)}>
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Image Modal */}
      {imageURL && (
        <Modal isOpen={imageModalOpen} onOpenChange={setImageModalOpen} className="flex flex-col p-4 w-[500px] h-[500px] z-1">
          <ModalContent>
            {(onClose) => (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Document Image
                  </h2>
                  <Button color="danger" onPress={onClose}>
                    Close
                  </Button>
                </div>
                <img src={imageURL} alt="Document" className="w-full h-full object-contain" />
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default DocumentVerificationModal;
