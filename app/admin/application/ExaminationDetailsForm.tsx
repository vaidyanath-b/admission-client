import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input } from "@nextui-org/react";
import axios from "axios";
import getUserSession from "@/lib/actions";
import { AdminApplicantContext } from "@/context/adminApplicantDetails/context";
import { apiUrl } from "@/lib/env";

const ExaminationDetailsForm = ({setTab} : {setTab:()=>void}) => {
  const context = React.useContext(AdminApplicantContext);

  if (!context) {
    throw new Error("useApplicantDetails must be used within an ApplicantDetailsContext");
  }

  const { qualifyingExaminationDetails, setQualifyingExaminationDetails, matriculationDetails, setMatriculationDetails} = context;
  
  
  const { control, handleSubmit, getValues } = useForm({
    defaultValues: {
      qualifyingExaminationDetails,
      matriculationDetails
    }
  });

  const onSubmit = (data: any) => {
    // Convert string values back to numbers
    const convertedData = {
      ...data,
      qualifyingExaminationDetails: {
        ...data.qualifyingExaminationDetails,
        percentage: Number(data.qualifyingExaminationDetails.percentage),
        yearOfPass: Number(data.qualifyingExaminationDetails.yearOfPass)
      },
      matriculationDetails: {
        ...data.matriculationDetails,
        percentage: Number(data.matriculationDetails.percentage)
      }
    };
    setQualifyingExaminationDetails(convertedData.qualifyingExaminationDetails);
    setMatriculationDetails(convertedData.matriculationDetails);
  };
  const saveAndNext = async (data: any) => {
    // Convert string values back to numbers

    const {accessToken} = await getUserSession();
    const convertedData = {
      ...data,
      qualifyingExaminationDetails: {
        ...data.qualifyingExaminationDetails,
        percentage: Number(data.qualifyingExaminationDetails.percentage),
        yearOfPass: Number(data.qualifyingExaminationDetails.yearOfPass)
      },
      matriculationDetails: {
        ...data.matriculationDetails,
        percentage: Number(data.matriculationDetails.percentage)
      }
    };
    setQualifyingExaminationDetails(convertedData.qualifyingExaminationDetails);
    setMatriculationDetails(convertedData.matriculationDetails);
    const {applicantId:qa , ...qData} = convertedData.qualifyingExaminationDetails;
    const {applicantId:ma , ...mData} = convertedData.matriculationDetails;
    await axios.post(`${apiUrl}/api/applicant/`,
      {
      qualifyingExaminationDetails:qData,
      matriculationDetails:mData
    },{
      headers: {
        Authorization: `Bearer ${accessToken || ""}`,
        "Content-Type": "application/json",
      },

    });
setTab(); 

};


  useEffect(() => {
    return () => {
      const values = getValues();
      onSubmit(values);
    };
  }, []);

  return (
    <form className="grid grid-cols-2 gap-7 p-5" onSubmit={handleSubmit(saveAndNext)}>
      <Controller
        name="qualifyingExaminationDetails.qualifyingExam"
        control={control}
        render={({ field }) => (
          <Input {...field} isRequired label="Qualifying Exam" placeholder="Enter Qualifying Exam" />
        )}
      />
      <Controller
        name="qualifyingExaminationDetails.regNoQualExam"
        control={control}
        render={({ field }) => (
          <Input {...field} isRequired label="Reg. No. Qual. Exam" placeholder="Enter Registration No" />
        )}
      />
      <Controller
        name="qualifyingExaminationDetails.qualifyingBoard"
        control={control}
        render={({ field }) => (
          <Input {...field} isRequired label="Qualifying Board" placeholder="Enter Qualifying Board" />
        )}
      />
      <Controller
        name="qualifyingExaminationDetails.percentage"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            isRequired
            label="Percentage"
            placeholder="Enter Percentage"
            type="number"
            value={field.value?.toString()} // Convert number to string
            onChange={(e) => field.onChange(Number(e.target.value))} // Convert string back to number
          />
        )}
      />
      <Controller
        name="qualifyingExaminationDetails.yearOfPass"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            isRequired
            label="Year of Pass"
            placeholder="Enter Year of Pass"
            type="number"
            value={field.value?.toString()} // Convert number to string
            onChange={(e) => field.onChange(Number(e.target.value))} // Convert string back to number
          />
        )}
      />
      <Controller
        name="qualifyingExaminationDetails.nameOfInstitution"
        control={control}
        render={({ field }) => (
          <Input {...field} isRequired label="Name of the Institution" placeholder="Enter Institution Name" />
        )}
      />
      <Controller
        name="matriculationDetails.board"
        control={control}
        render={({ field }) => (
          <Input {...field} isRequired label="Matriculation Board" placeholder="Enter Board" />
        )}
      />
      <Controller
        name="matriculationDetails.nameOfInstitution"
        control={control}
        render={({ field }) => (
          <Input {...field} isRequired label="Name of Institution" placeholder="Enter Institution Name" />
        )}
      />

      <Controller
        name="matriculationDetails.regNoYearOfPass"
        control={control}
        render={({ field }) => (
          <Input {...field} isRequired label="Matriculation Reg No & Year of Pass" placeholder="Enter Reg No & Year" />
        )}
      />
      <Controller
        name="matriculationDetails.percentage"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            isRequired
            label="Matriculation Percentage"
            placeholder="Enter Percentage"
            type="number"
            value={field.value?.toString()} // Convert number to string
            onChange={(e) => field.onChange(Number(e.target.value))} // Convert string back to number
          />
        )}
      />
      <Controller
        name="matriculationDetails.aadharNo"
        control={control}
        render={({ field }) => (
          <Input {...field} isRequired label="Aadhar No" placeholder="Enter Aadhar No" />
        )}
      />

      

      <Button type="submit"  variant="solid" color="primary" className="col-start-2 w-max ml-auto mr-10 mt-4">Save And Next</Button>

</form>
  );
};

export default ExaminationDetailsForm;
