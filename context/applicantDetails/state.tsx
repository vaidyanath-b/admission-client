"use client"
import { useContext, useEffect, useState } from "react";
// import { ApiContext } from "../api/ApiContext";
// import { jwtDecode } from "jwt-decode";
import axios, { AxiosInstance } from "axios";

// Define the default values for the context

// Create the context with the typed default values
import { ApplicantDetailsContext } from "./context";
import { ApplicantDetails, ParentDetails, Address, PreviousInstitutionDetails, QualifyingExaminationDetails, MatriculationDetails, BankDetails, IDocumentDetails, Allotment } from "./interface";
import { AuthContext } from "../auth/context";
import getUserSession from "@/lib/actions";
import { apiUrl } from "@/lib/env";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
const ApplicationState: React.FC<{children: React.ReactNode}> = ({ children }) => {
      const context = useContext(AuthContext);
      if (!context) {
        throw new Error("useAuth must be used within a AuthProvider");
      }
      const {   user , authLoading } = context;

  
  const [userError, setUserError] = useState("");
  const [applicationLoading , setApplicationLoading] = useState(true);
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





  useEffect(() => {
    async function fetchUserApplication() {
      if(authLoading)
        return;
      
      if(!user){
        setUserError("User not found");
        return;
      }
  
      let response;
      try {
        const {accessToken} = await getUserSession();

        if(!accessToken){
          return;
        }
        const {user_role} =  jwtDecode(accessToken) as any
        if(user_role == "ADMIN"){
          redirect("/admin")
        }

        console.log("fetching application");
        response = await axios.get(`${apiUrl}/api/applicant`, {
        headers: {
          Authorization: `Bearer ${accessToken || ""}`,
          "Content-Type": "application/json",
        },
        
        
      },

    );
      console.log(response , "fetched application");
    
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
    }
    setApplicationLoading(false);
    }
    if(user){
        fetchUserApplication();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return <ApplicantDetailsContext.Provider
    value={{
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
        setDocuments
      }}
    >
      {children}
    </ApplicantDetailsContext.Provider>
}

  export default ApplicationState;