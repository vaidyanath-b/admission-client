"use client";
import { title } from "@/components/primitives";
import { AuthContext } from "@/context/auth/context";
import { MetaContext } from "@/context/metaContext/context";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import { Accordion, Avatar, Button, Card, CardBody, CardHeader, Chip, Dropdown, Kbd, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip } from "@nextui-org/react";
import { useContext, useState } from "react";
import { deletePhaseDocument, createDocument, createPhase, addPhaseDocument, deleteDocument, editDocument } from "./utils";
import getUserSession from "@/lib/actions";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"; 
import {faPlus} from "@fortawesome/free-solid-svg-icons";
const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

export default function BlogPage() {

  const [documentIdsToDelete, setDocumentIdsToDelete] = useState<string[]>([]);
  const [documentsToEdit, setDocumentsToEdit] = useState<{[key:string] :{name: string }}>({});
  const { isOpen, onOpen: openModal, onOpenChange } = useDisclosure();
  const [selectedDocumentId, setSelectedDocumentId] = useState<String | null>(null);
  const [selectedPhaseId, setSelectedPhaseId] = useState<number | null>(null);
  const [currentEditable, setCurrentEdit] = useState(null);
  const [dropdownEnable , setDropdownEnable]  = useState(null);

  const authContext = useContext(AuthContext);
  const metaContext = useContext(MetaContext);
  if (!authContext || !metaContext) {
    throw new Error("useContext must be used within a Provider");
  }
  const { authLoading } = authContext;
  const { phases, documents, phaseDocuments, setPhases, setDocuments, setPhaseDocuments,loading } = metaContext;

  const onOpen = (phaseId: number, documentId: string) => {
    setSelectedPhaseId(phaseId);
    setSelectedDocumentId(documentId);
    openModal();
  };

  const handleCloseDocument = async (phaseId: any, documentId: any) => {
    await deletePhaseDocument(phaseId, documentId);
    setPhaseDocuments(phaseDocuments.filter((pd) => pd.phaseId !== phaseId || pd.documentTypeCode !== documentId));
    onOpenChange();
  };

  const handleEditDocument = (documentId:string  , documentName:string) => {

  
    setDocumentsToEdit({...documentsToEdit, [documentId]:{name:documentName}});
  
    setDocuments(documents.map((doc) => doc.code === documentId ? {name:documentName, code:documentId} : doc));
    console.log("Edit document", documentId);
  };

  const handleDeleteDocument = async (documentId: any) => {
    // Implement your delete logic here
    setDocumentIdsToDelete([...documentIdsToDelete, documentId]);
    console.log("Delete document", documentId);
    setDocuments(documents.filter((doc) => doc.code !== documentId));
  };

  const renderDocumentCell = (document: any, columnKey: React.Key) => {
    const cellValue = document[columnKey as keyof typeof document];
    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit document">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => setCurrentEdit(document.code)}>
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete document">
              <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDeleteDocument(document.code)}>
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    !loading && <main className={`flex flex-col min-w-screen gap-x-5 lg:flex-row`}>
      <div className="flex flex-1 min-h-screen flex-col gap-4">
        <h1 className="text-center text-[1.7rem] lg:text-[2.1rem] lg:text-5xl leading-9 tracking-tight font-semibold">
          Document Types
        </h1>
        <Card className="self-center p-2 mt-4">
          <CardHeader>Create Document Type</CardHeader>
          <CardBody className="gap-2">
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget); // Create FormData object from the form
              const name = formData.get('name') as string;
              const code = formData.get('code') as string;
              if (!name || !code) {
                alert("Please enter name and code");
                return;
              }
              await createDocument({ name, code });
              setDocuments([...documents, { name, code }]);
            }}>
              <Input placeholder="Enter name" name="name" className="w-max" />
              <Input placeholder="Enter document type code" name="code" className="w-max" />
              <Button color="primary" variant="light" type="submit">Create</Button>
            </form>
          </CardBody>
        </Card>
        <h1 className="self-start text-[1.7rem] lg:text-[2.1rem] lg:text-5xl leading-9 tracking-tight font-semibold">
          Documents
        </h1>
        <Table aria-label="Documents Table">
          <TableHeader>
            <TableColumn>Title</TableColumn>
            <TableColumn>Name</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {documents.map((document, index) => (
              <TableRow key={index}>
                <TableCell>{document.code}</TableCell>
                <TableCell>
                  {document.code === currentEditable ? <Input placeholder="Enter name" value={String(document.name)} name="name" className="w-max" onChange={(e)=>{
                    const key = String(document.code);
                    handleEditDocument(key, e.target.value);
                    }} /> :
                  document.name}</TableCell>
                <TableCell>{renderDocumentCell(document, "actions")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {(documentIdsToDelete.length > 0 || Object.keys(documentsToEdit).length > 0) && 
            <Button color="primary" variant="light" onPress={async () => {
              for (const documentId of documentIdsToDelete) {
                await deleteDocument(documentId);
              }
              for (const key of Object.keys(documentsToEdit)) {
                console.log("Edit document", key);
                await editDocument({code: key, name: documentsToEdit[key].name});
              }
              setDocumentIdsToDelete([]);
              setDocumentsToEdit({});
              setCurrentEdit(null);
            }
          }
        >Save Changes</Button>}
      </div>
      <Divider orientation="vertical" style={{ height: 'auto', alignSelf: 'stretch' }} />
      <div className="flex flex-1 min-h-screen flex-col items-center">
        <h1 className={'text-[1.7rem] lg:text-[2.1rem] lg:text-5xl leading-9 tracking-tight font-semibold'}>Phases</h1>
        <>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1">Are you sure?</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete document ID {selectedDocumentId} from phase {selectedPhaseId}?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={() => onOpenChange()}>
                  Cancel
                </Button>
                <Button color="primary" onPress={() => handleCloseDocument(selectedDocumentId, selectedPhaseId)}>
                  Delete
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
        {phases.map((phase) => (
          <Card key={phase.order} className="w-[600px] items-center">
            <CardHeader className="w-full">Phase {phase.order}</CardHeader>
            <CardBody className="w-full gap-2">
              <p>{phase.description}</p>
              <div className="flex flex-col gap-2">
        <Select
        variant="underlined"
      items={documents.filter((doc) => !phaseDocuments.find((pd) => pd.documentTypeCode === doc.code))}
      label="Document"
      placeholder="Select a documnet"
      className="max-w-xs"
      onChange={(e) => {
        if (e.target.value) {
          if(phaseDocuments.find((pd) => pd.documentTypeCode === e.target.value)){
            alert("Document already added to this phase");
            return;
          }
          addPhaseDocument(phase.order, e.target.value);
          setPhaseDocuments([...phaseDocuments, { phaseId: phase.order, documentTypeCode: e.target.value }]);
          //
        }
      
      }
      }
>
      {(doc) => <SelectItem key={String(doc.code)}>{doc.name}</SelectItem>}
    </Select>
                {phaseDocuments.filter((pd) => pd.phaseId === phase.order)
                  .map((doc) => (
                    <Chip key={String(doc.documentTypeCode)} onClose={() => onOpen(phase.order, doc.documentTypeCode)} variant="flat">
                      {documents.find((d) => d.code === doc.documentTypeCode)?.name}
                    </Chip>
                  ))}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </main>
  );
}
