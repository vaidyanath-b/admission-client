import React, { useContext, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, DatePicker, Input } from "@nextui-org/react";
import { ApplicantDetailsContext } from "@/context/applicantDetails/context"; 
import axios from "axios";
import { PreviousInstitutionDetails } from "@/context/applicantDetails/interface";
import {DateValue, parseDate, getLocalTimeZone} from "@internationalized/date";
import {useDateFormatter} from "@react-aria/i18n";
import { apiUrl } from "@/lib/env";
import getUserSession from "@/lib/actions";

const PreviousInstitutionForm = ({setTab} : {setTab:()=>void})=> {
  const context = useContext(ApplicantDetailsContext);
  if (!context) {
    throw new Error("useApplicantDetails must be used within an ApplicantDetailsContext");
  }
  const defaultDateValue =  "2024-01-01"
  const { previousInstitutionDetails, setPreviousInstitutionDetails } = context;
  const { control, getValues, handleSubmit } = useForm<PreviousInstitutionDetails>({
    defaultValues: {
      ...previousInstitutionDetails,
    }
  });

  const onSubmit = (data: PreviousInstitutionDetails) => {
    setPreviousInstitutionDetails(
      {
        ...data,
        }
    );

  };

  const saveAndNext = async (data: PreviousInstitutionDetails) => {
    const {accessToken} = await getUserSession();
    const convertedData = {
      ...data,
      dateOfAdmission: new Date(data.dateOfAdmission),
      tcDate: new Date(data.tcDate),
    };
    setPreviousInstitutionDetails(convertedData);
    const {applicantId , ...dataToSend} = convertedData;
    await axios.post(`${apiUrl}/api/applicant/`,
      {
      previousInstitutionDetails:dataToSend
    },{        headers: {
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
        name="nameOfInstitution"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Name of the Institution" placeholder="Enter Institution Name" />}
      />
      <Controller
        name="dateOfAdmission"
        control={control}
        render={({ field }) => <DatePicker {...field} isRequired label="Date of Admission" showMonthAndYearPickers
        value={parseDate(field.value?.toString().split("T")[0] || defaultDateValue) } 
        />}
      />
      <Controller
        name="course"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Course" placeholder="Enter Course" />}
      />
      <Controller
        name="category"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Category" placeholder="Enter Category" />}
      />
      <Controller
        name="reservation"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Reservation" placeholder="Enter Reservation" />}
      />
      <Controller
        name="previousInstitution"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Previous Institution" placeholder="Enter Previous Institution" />}
      />
      <Controller
        name="tcNo"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="TC No" placeholder="Enter TC No" />}
      />
      <Controller
        name="tcDate"
        control={control}
        render={({ field }) => <DatePicker {...field} isRequired label="TC Date" showMonthAndYearPickers
          value ={parseDate(field.value?.toString().split("T")[0] || defaultDateValue)}
        />}
      />
            <Button type="submit"  variant="solid" color="primary" className="col-start-2 w-max ml-auto mr-10 mt-4">Save And Next</Button>

    </form>
  );
};

export default PreviousInstitutionForm;