"use client"
import { useContext, useEffect, useState } from "react";
// import { ApiContext } from "../api/ApiContext";
// import { jwtDecode } from "jwt-decode";
import axios, { AxiosInstance } from "axios";

// Define the default values for the context

// Create the context with the typed default values
import { AdminApplicantContext } from "./context";
import { ApplicantDetails, ParentDetails, Address, PreviousInstitutionDetails, QualifyingExaminationDetails, MatriculationDetails, BankDetails, IDocumentDetails, Allotment } from "../applicantDetails/interface";
import { AuthContext } from "../auth/context";
import getUserSession from "@/lib/actions";
import { apiUrl } from "@/lib/env";
import { Spinner } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
const ApplicationState: React.FC<{children: React.ReactNode}> = ({ children }) => {
      const context = useContext(AuthContext);
      if (!context) {
        throw new Error("useAuth must be used within a AuthProvider");
      }
      const searchParams = useSearchParams()
      const id = searchParams.get("id")
    
  const { user , authLoading } = context;
  const [userError, setUserError] = useState("");
  const [applicationLoading , setApplicationLoading] = useState(true);
  const [applicantId , setApplicantId] = useState<number | null>(id? Number(id) : null);
  const [applicantDetails, setApplicantDetails] = useState<ApplicantDetails | null>(null);
  const [parentDetails, setParentDetails] = useState<ParentDetails | null>(null);
  const [permanentAddress, setPermanentAddress] = useState<Address | null>(null);
  const [presentAddress, setPresentAddress] = useState<Address | null>(null);
  const [guardianAddress, setGuardianAddress] = useState<Address | null>(null);
  const [previousInstitutionDetails, setPreviousInstitutionDetails] = useState<PreviousInstitutionDetails | null>(null);
  const [qualifyingExaminationDetails, setQualifyingExaminationDetails] = useState<QualifyingExaminationDetails | null>(null);
  const [matriculationDetails, setMatriculationDetails] = useState<MatriculationDetails | null>(null);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [Documents, setDocuments] = useState<IDocumentDetails[]>([])
  const [Allotments, setAllotments] = useState<Allotment[]>([])
  const [applicantError , setApplicantError] = useState<any>(null);
  useEffect(() => {

    if(!applicantId){
      console.log("no applicant id found");
      setApplicationLoading(false);
      return;
    }
    async function fetchUserApplication() {
      const {accessToken} = await getUserSession();
      if(authLoading)
        return;
      
      if(!user){
        setUserError("User not found");
        return;
      }
      let response;
      try {
        setApplicationLoading(true)
        console.log("fetching admin application", accessToken);
        response = await axios.get(`${apiUrl}/api/admin/applicant/${Number(applicantId)}`, {
        headers: {
          Authorization: `Bearer ${accessToken || ""}`,
          "Content-Type": "application/json",
        },
        
        
      },

    );
      console.log(response , "fetched application");
      setApplicationLoading(false)
    
      } catch (err) {
          console.log(err, "error in fetchApplication");
          setApplicationLoading(false)
      return;
      }
      
      if (response.status === 200){
      setApplicantDetails(response.data.ApplicantDetails);
      setParentDetails(response.data.parentDetails);
      setPermanentAddress(response.data.permanentAddress);
      setPresentAddress(response.data.presentAddress);
      setGuardianAddress(response.data.guardianAddress);
      setPreviousInstitutionDetails(response.data.previousInstitutionDetails);
      setQualifyingExaminationDetails(response.data.qualifyingExaminationDetails);
      setMatriculationDetails(response.data.matriculationDetails);
      setBankDetails(response.data.bankDetails);
      setDocuments(response.data.Document);
      setAllotments(response.data.Allotment);
      setApplicantError(null)
    }
    setApplicationLoading(false);
    }
    if(user){
        fetchUserApplication();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicantId]);

  return <AdminApplicantContext.Provider
    value={{
        applicantId,
        applicationLoading,
        applicantDetails,
        parentDetails,
        permanentAddress,
        presentAddress,
        guardianAddress,
        previousInstitutionDetails,
        qualifyingExaminationDetails,
        matriculationDetails,
        bankDetails,
        Documents,
        Allotments,
        setAllotments,
        setApplicantDetails,
        setParentDetails,
        setPermanentAddress,
        setPresentAddress,
        setGuardianAddress,
        setPreviousInstitutionDetails,
        setQualifyingExaminationDetails,
        setMatriculationDetails,
        setBankDetails,
        setDocuments,
        setApplicantId
      }}
    >
      
      {applicationLoading? <Spinner className="h-screen w-full self-center m-auto"color="warning"/> : children}
    </AdminApplicantContext.Provider>
}

  export default ApplicationState;