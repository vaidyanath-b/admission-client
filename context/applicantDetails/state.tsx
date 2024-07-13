"use client"
import { useContext, useEffect, useState } from "react";
// import { ApiContext } from "../api/ApiContext";
// import { jwtDecode } from "jwt-decode";
import axios, { AxiosInstance } from "axios";

// Define the default values for the context

// Create the context with the typed default values
import { ApplicantDetailsContext } from "./context";
import { ApplicantDetails, ParentDetails, Address, PreviousInstitutionDetails, QualifyingExaminationDetails, MatriculationDetails, BankDetails } from "./interface";
import { AuthContext } from "../auth/context";
const ApplicationState: React.FC<{children: React.ReactNode}> = ({ children }) => {
      const context = useContext(AuthContext);
      if (!context) {
        throw new Error("useAuth must be used within a AuthProvider");
      }
      const { axiosPriv , user ,accessToken, authLoading } = context;

  
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
        console.log("fetching application");
      response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/applicant`, {
        headers: {
          Authorization: `Bearer ${accessToken || ""}`,
          "Content-Type": "application/json",
        },
        
        
      },

    );
      console.log(response , "fetched application");
    
      } catch (err) {
          console.log(err, "error in fetchApplication");
      return;
      }
      
      if (response){
      setApplicantDetails(response.data.ApplicantDetails);
      setParentDetails(response.data.parentDetails);
      setPermanentAddress(response.data.permanentAddress);
      setPresentAddress(response.data.presentAddress);
      setGuardianAddress(response.data.guardianAddress);
      setPreviousInstitutionDetails(response.data.previousInstitutionDetails);
      setQualifyingExaminationDetails(response.data.qualifyingExaminationDetails);
      setMatriculationDetails(response.data.matriculationDetails);
      setBankDetails(response.data.bankDetails);
    }
    setApplicationLoading(false);
    }
    if(user){
        fetchUserApplication();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken,authLoading,user]);

  return <ApplicantDetailsContext.Provider
    value={{
      accessToken,
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
        setApplicantDetails,
        setParentDetails,
        setPermanentAddress,
        setPresentAddress,
        setGuardianAddress,
        setPreviousInstitutionDetails,
        setQualifyingExaminationDetails,
        setMatriculationDetails,
        setBankDetails,
      }}
    >
      {children}
    </ApplicantDetailsContext.Provider>
}

  export default ApplicationState;