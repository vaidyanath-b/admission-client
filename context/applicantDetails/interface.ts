import { AxiosInstance } from "axios";
import { Dispatch, SetStateAction } from "react";
export interface ApplicantDetails {
  applicantId?: string;
  admissionNo: string;
  name: string;
  dateOfBirth: Date; // YYYY-MM-DD format
  gender: string;
  caste: string;
  religion: string;
  nativity: string;
  community: string;
  village: string;
  taluk: string;
  bloodGroup: string;
  studentMobile: string;
  studentEmail: string;
  annualIncomeOfParents: string;
}

export interface ParentDetails {
  applicantId?: string;
  fatherName: string;
  fatherOccupation: string;
  fatherEmail: string;
  fatherPhone: string;
  motherName: string;
  motherOccupation: string;
  motherEmail: string;
  motherPhone: string;
}

export interface Address {
  applicantId?: string;
  addressLines: string;
  postOffice: string;
  district: string;
  state: string;
  phoneNumber?: string; // Optional for Permanent and Present Address
}

export interface PreviousInstitutionDetails {
  applicantId?: string;
  nameOfInstitution: string;
  dateOfAdmission: Date; // YYYY-MM-DD format
  course: string;
  category: string;
  reservation: string;
  previousInstitution: string;
  tcNo: string;
  tcDate: Date; // YYYY-MM-DD format
}

export interface QualifyingExaminationDetails {
  applicantId?: string;
  qualifyingExam: string;
  regNoQualExam: string;
  qualifyingBoard: string;
  percentage: number;
  yearOfPass: number;
  nameOfInstitution: string;
}

export interface MatriculationDetails {
  applicantId?: string;
  board: string;
  nameOfInstitution: string;
  regNoYearOfPass: string;
  percentage: number;
  aadharNo: string;
}

export interface BankDetails {
  applicantId?: string;
  branch: string;
  accountNo: string;
  ifscCode: string;
}

export interface IDocumentDetails {
  filename: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  applicantId?: number; // Assuming Applicant ID is a number
  documentTypeCode: string;
}
export interface Allotment {
  allotment: number;
  applicantId?: number;
  course: string; // Assuming Course is defined elsewhere
  quota: string; // Assuming Quota is defined elsewhere
  allotmentMemoLink?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ApplicantContextType {
  // axiosPriv: AxiosInstance | null;
  accessToken: string;
  applicationLoading: boolean;
  applicantDetails: ApplicantDetails | null;
  parentDetails: ParentDetails | null;
  permanentAddress: Address | null;
  presentAddress: Address | null;
  guardianAddress: Address | null;
  previousInstitutionDetails: PreviousInstitutionDetails | null;
  qualifyingExaminationDetails: QualifyingExaminationDetails | null;
  matriculationDetails: MatriculationDetails | null;
  bankDetails: BankDetails | null;
  Documents: IDocumentDetails[];
  Allotments: Allotment[];
  setDocuments: Dispatch<SetStateAction<IDocumentDetails[]>>;
  setApplicantDetails: Dispatch<SetStateAction<ApplicantDetails | null>>;
  setParentDetails: Dispatch<SetStateAction<ParentDetails | null>>;
  setPermanentAddress: Dispatch<SetStateAction<Address | null>>;
  setPresentAddress: Dispatch<SetStateAction<Address | null>>;
  setGuardianAddress: Dispatch<SetStateAction<Address | null>>;
  setPreviousInstitutionDetails: Dispatch<
    SetStateAction<PreviousInstitutionDetails | null>
  >;
  setQualifyingExaminationDetails: Dispatch<
    SetStateAction<QualifyingExaminationDetails | null>
  >;
  setMatriculationDetails: Dispatch<
    SetStateAction<MatriculationDetails | null>
  >;
  setBankDetails: Dispatch<SetStateAction<BankDetails | null>>;
  setAllotments: Dispatch<SetStateAction<Allotment[]>>;
}
