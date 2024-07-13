import React, { useContext, useState, ChangeEvent } from "react";
import { Accordion, AccordionItem, Button, Modal, Image, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, Select, SelectItem } from "@nextui-org/react";
import axios from "axios";
import { IDocument, MetaContext } from "@/context/metaContext/context";
import { ApplicantDetailsContext } from "@/context/applicantDetails/context";
import getUserSession from "@/lib/actions";
import { createClient } from "@/lib/supabase/client";

// Hardcoded allotments
const hardcodedAllotments = [1, 2, 3];

// Hardcoded courses and quotas
const courses = ["COMPUTER_SCIENCE", "ELECTRONICS", "MECHANICAL", "ELECTRICAL"];
const quotas = ["GENERAL", "SC", "ST", "OBC", "EWS"];

const DocumentUpload: React.FC = () => {
  const metaContext = useContext(MetaContext);
  const docsContext = useContext(ApplicantDetailsContext);
  if (!metaContext || !docsContext) {
    throw new Error("useContext must be used within a Provider");
  }

  const { documents: metaDocuments } = metaContext;
  const { Documents, setDocuments, Allotments, setAllotments } = docsContext;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const [selectedAllotment, setSelectedAllotment] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedQuota, setSelectedQuota] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, type: 'document' | 'allotment', code?: string) => {
    if (!event.target.files) {
      alert("No file selected.");
      return;
    }
    const file = event.target.files[0];
    if (type === 'document' && code) {
      setSelectedFiles((prevState) => ({
        ...prevState,
        [code]: file,
      }));
    } else if (type === 'allotment' && selectedAllotment) {
      setSelectedFiles((prevState) => ({
        ...prevState,
        [`allotment_${selectedAllotment}`]: file,
      }));
    }
  };

  const handleSaveChanges = async (type: 'document' | 'allotment', code?: string) => {
    try {
      const { accessToken } = await getUserSession();
      let file: File | null = null;
      let url: string = '';

      if (type === 'document' && code) {
        file = selectedFiles[code];
        url = `http://localhost:3000/api/document/${code}`;
      } else if (type === 'allotment' && selectedAllotment) {
        file = selectedFiles[`allotment_${selectedAllotment}`];
        url = `http://localhost:3000/api/document/memo`;
      }

      if (!file) {
        alert("Please select a file before saving.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      let body={}
      if (type === 'allotment') {
        if(!selectedAllotment || !selectedCourse || !selectedQuota) {
          alert("Please select an allotment, course, and quota before saving.");
          return;
        }
        formData.append("course", selectedCourse);
        formData.append("quota", selectedQuota);
        formData.append("allotment", selectedAllotment?.toString() || "");
      }


      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken || ""}`,
        }
      });
      console.log("File uploaded successfully:", response.data);


      if (type === 'document' && code) {
        const updatedDocuments = Documents?.map(doc =>
          doc.documentTypeCode === code
            ? { ...doc, filename: response.data.filename , url: response.data.filename , updatedAt: new Date() }
            : doc
        );
        if (!updatedDocuments?.some(doc => doc.documentTypeCode === code)) {
          updatedDocuments?.push({ documentTypeCode: code, filename: response.data.filename , applicantId: response.data.filename , url: response.data.filename , createdAt: new Date(), updatedAt: new Date() });
        }
        setDocuments(updatedDocuments);
      } else if (type === 'allotment') {
        if(!selectedAllotment) {
          alert("Please select an allotment before saving.");
          return;
        }
        const updatedAllotments = Allotments.map(a =>
          a.allotment === selectedAllotment 
            ? { ...a, allotmentMemoLink: response.data.filename, course: selectedCourse, quota: selectedQuota } 
            : a
        );
        if (!updatedAllotments.some(a => a.allotment === selectedAllotment)) {
          updatedAllotments.push({
            allotment: selectedAllotment,
            allotmentMemoLink: response.data.filename,
            course: selectedCourse,
            quota: selectedQuota
          });
        }
        setAllotments(updatedAllotments);
      }

      alert(`${type === 'document' ? 'Document' : 'Allotment memo'} uploaded successfully!`);
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      alert(`Error uploading ${type}. Please try again.`);
    }
  };

  const handleViewFile = async (type: 'document' | 'allotment', filename: string) => {
    try {
      const url = await downloadFile("admission", filename);
      if (url) {
        setImageUrl(url);
        onOpen();
      }
    } catch (error) {
      console.error("Error viewing file:", error);
      alert("Error viewing file. Please try again.");
    }
  };

  const isAllotmentUploaded = (allotmentNumber: number) => {
    return Allotments.some(a => a.allotment === allotmentNumber && a.allotmentMemoLink);
  };

  const handleAllotmentChange = (allotmentNumber: number |null) => {
    setSelectedAllotment(allotmentNumber);
    const existingAllotment = Allotments.find(a => a.allotment === allotmentNumber);
    if (existingAllotment) {
      setSelectedCourse(existingAllotment.course);
      setSelectedQuota(existingAllotment.quota);
    } else {
      setSelectedCourse("");
      setSelectedQuota("");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Document Upload</h2>

      {/* Allotment Details Section */}
      <div className="mb-8 p-4 border rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Allotment Details</h3>
        <Select
          label="Select Allotment"
          placeholder="Choose an allotment"
          className="max-w-xs mb-4"
          selectedKeys={selectedAllotment ? [selectedAllotment.toString()] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0];
            handleAllotmentChange(selected ? parseInt(selected.toString()) : null);
          }}
        >
          {hardcodedAllotments.map((allotment) => (
            <SelectItem key={allotment.toString()} value={allotment}>
              Allotment {allotment}
            </SelectItem>
          ))}
        </Select>

        {selectedAllotment && (
          <>
            <Select
              label="Select Course"
              placeholder="Choose a course"
              className="max-w-xs mb-4"
              selectedKeys={selectedCourse ? [selectedCourse] : []}
              onSelectionChange={(keys) => setSelectedCourse(Array.from(keys)[0] as string)}
            >
              {courses.map((course) => (
                <SelectItem key={course} value={course}>
                  {course}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Select Quota"
              placeholder="Choose a quota"
              className="max-w-xs mb-4"
              selectedKeys={selectedQuota ? [selectedQuota] : []}
              onSelectionChange={(keys) => setSelectedQuota(Array.from(keys)[0] as string)}
            >
              {quotas.map((quota) => (
                <SelectItem key={quota} value={quota}>
                  {quota}
                </SelectItem>
              ))}
            </Select>

            {isAllotmentUploaded(selectedAllotment) ? (
              <Button onClick={() => {
                const allotment = Allotments.find(a => a.allotment === selectedAllotment);
                if (allotment && allotment.allotmentMemoLink) {
                  handleViewFile('allotment', allotment.allotmentMemoLink);
                }
              }}>View Memo</Button>
            ) : (
              <div>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 p-4"
                  onChange={(event) => handleFileChange(event, 'allotment')}
                />
                <Button
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mt-4"
                  onClick={() => handleSaveChanges('allotment')}
                  disabled={!selectedCourse || !selectedQuota}
                >
                  Upload Allotment Memo
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Document Upload Section */}
      <Accordion variant="light">
        {metaDocuments.map((metaDoc: IDocument) => {
          const existingDoc = Documents?.find(doc => doc.documentTypeCode === metaDoc.code);
          return (
            <AccordionItem
              key={metaDoc.code}
              aria-label={`Document ${metaDoc.code}`}
              title={metaDoc.name}
              className="font-bold text-large"
            >
              {existingDoc ? (
                <div>
                  <Button onClick={() => handleViewFile('document', existingDoc.filename)}>View</Button>
                  <input
                    type="file"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 p-4"
                    onChange={(event) => handleFileChange(event, 'document', metaDoc.code)}
                  />
                  <Button
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mt-4"
                    onClick={() => handleSaveChanges('document', metaDoc.code)}
                  >
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div className="w-4/12">
                  <input
                    type="file"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 p-4"
                    onChange={(event) => handleFileChange(event, 'document', metaDoc.code)}
                  />
                  <Button
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mt-4"
                    onClick={() => handleSaveChanges('document', metaDoc.code)}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Modal for viewing files */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Uploaded File</ModalHeader>
              <ModalBody>
                {imageUrl && <Image width={300} alt="Uploaded File" className="self-center" src={imageUrl} />}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>Close</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

async function downloadFile(
  bucketName: string,
  filePath: string
): Promise<string | null> {
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
      return URL.createObjectURL(data)
    }
  } catch (error) {
    console.error("Error downloading file:", error);
  }
  console.log("Error downloading file");
  return null;
}


export default DocumentUpload;