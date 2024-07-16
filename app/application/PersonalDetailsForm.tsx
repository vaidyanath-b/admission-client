import React, { useContext, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input } from "@nextui-org/react";
import { ApplicantDetailsContext } from "@/context/applicantDetails/context"; import axios from "axios";
import { ApplicantDetails } from "@/context/applicantDetails/interface";
import {parseDate} from "@internationalized/date";
import { apiUrl } from "@/lib/env";
import { DatePicker } from "@/components/DayPicker";
import "react-datepicker/dist/react-datepicker.css";


import getUserSession from "@/lib/actions";
import dayjs from "dayjs";

const PersonalDetailsForm = ({setTab} : {setTab:()=>void}) => {
  const defaultDate = new Date("01-01-2006")
  const context = useContext(ApplicantDetailsContext);
  if (!context) {
    throw new Error("useApplicantDetails must be used within an ApplicantDetailsContext");
  }
  const { applicationLoading, applicantDetails, setApplicantDetails } = context;
  
  const { control, getValues, handleSubmit } = useForm<ApplicantDetails>({
    defaultValues: {
      ...applicantDetails,
      dateOfBirth: applicantDetails?.dateOfBirth || defaultDate
    }
  });

  const onSubmit = (data:any) => {
    const convertedData = {
      ...data,
      annualIncomeOfParents: String(data.annualIncomeOfParents),
      
    };
    setApplicantDetails(data);
  }
  const saveAndNext = async (data:any) => {
    const {accessToken} = await getUserSession();

    const convertedData = {
      ...data,
      annualIncomeOfParents: String(data.annualIncomeOfParents),
      dateOfBirth: new Date(data.dateOfBirth),
    };
    const {applicantId , ...dataToSend} = convertedData;
    setApplicantDetails(data);
const res = await axios.post(
      `${apiUrl}/api/applicant`,
      { 
        ApplicantDetails: dataToSend,
        
       }, // This is the data payload
      {
        headers: {
          Authorization: `Bearer ${accessToken || ""}`,
          "Content-Type": "application/json",
        },
      } // This is the Axios request configuration object, including headers
    );
setTab();  }



  return (
    <form className="grid grid-cols-2 gap-7 p-5" onSubmit={handleSubmit(saveAndNext)}>
      <Controller
        name="admissionNo"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Admission No" placeholder="Enter Admission No" />}
      />
      <Controller
        name="name"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Name (in block letters)" placeholder="Enter Name" />}
      />

<Controller
      name="dateOfBirth"
      control={control}
      render={({ field }) => {
        const dateValue = field.value ? new Date(field.value): defaultDate;
        return (
          <DatePicker
            {...field}
            required
            placeholder="Date of Birth (DD/MM/YYYY)"
            value={dateValue.toUTCString()}
            />
        );
      }}
    />
      <Controller
        name="gender"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Gender" placeholder="Enter Gender" />}
      />
      <Controller
        name="caste"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Caste" placeholder="Enter Caste" />}
      />
      <Controller
        name="religion"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Religion" placeholder="Enter Religion" />}
      />
      <Controller
        name="nativity"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Nativity" placeholder="Enter Nativity" />}
      />
      <Controller
        name="community"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Community" placeholder="Enter Community" />}
      />
      <Controller
        name="village"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Village" placeholder="Enter Village" />}
      />
      <Controller
        name="taluk"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Taluk" placeholder="Enter Taluk" />}
      />
      <Controller
        name="bloodGroup"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Blood Group" placeholder="Enter Blood Group" />}
      />
      <Controller
        name="studentMobile"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Student's Mobile" placeholder="Enter Mobile No" />}
      />
      <Controller
        name="studentEmail"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Student's Email" placeholder="Enter Email" type="email" />}
      />
      <Controller
        name="annualIncomeOfParents"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Annual Income of Parents" placeholder="Enter Annual Income"  type="number"
          onChange={(e) => {
            field.onChange(Number(e.target.value || 0));
            
          }
        }
        value={field.value?.toString()}
        
        />}
      />
                  <Button type="submit"  variant="solid" color="primary" className="col-start-2 w-max ml-auto mr-10 mt-4">Save And Next</Button>


    </form>
  );
};

export default PersonalDetailsForm;