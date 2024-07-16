import React, { use, useContext, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Spacer } from "@nextui-org/react";
 import axios from "axios";
import getUserSession from "@/lib/actions";
import { AdminApplicantContext } from "@/context/adminApplicantDetails/context";
import { apiUrl } from "@/lib/env";


const ParentsForm = ({setTab} : {setTab:()=>void}) => {

  const context = useContext(AdminApplicantContext);
  if (!context) {
    throw new Error("useApplicantDetails must be used within an ApplicantDetailsContext");
  }
  const { applicationLoading,parentDetails , setParentDetails ,applicantId} = context;
  const { control , getValues , handleSubmit  } = useForm({
    defaultValues: {
      ...parentDetails
    }
  });

  const onSubmit = (data: any) => {
    setParentDetails(data);
  };
  const saveAndNext = async (data: any) => {
    try{
    const {accessToken} = await getUserSession();
    setParentDetails(data);
        const {applicantId:a , ...dataToSend} = data;
const res = await axios.post(
      `${apiUrl}/api/admin/applicant/${applicantId}`,
      { parentDetails: dataToSend
       }, // This is the data payload
      {
        headers: {
          Authorization: `Bearer ${accessToken || ""}`,
          "Content-Type": "application/json",
        },
      } // This is the Axios request configuration object, including headers
    );
      console.log(res,"res");
      setTab();  
  }
  catch(err){
    console.error (err);
    alert("Error in saving data .please check form or contact staff" );
  }


};

  useEffect(() => {
    return () => {
      const values = getValues();
      onSubmit(values);
    };
  }, []);



  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit(saveAndNext)}>
      <h3 className="col-span-1 md:col-span-2">Father's Details</h3>
      <Controller
        name="fatherName"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Father's Name" placeholder="Enter Father's Name" />}
      />
      <Controller
        name="fatherOccupation"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Father's Occupation" placeholder="Enter Father's Occupation" />}
      />
      <Controller
        name="fatherEmail"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Father's Email Address" placeholder="Enter Father's Email" type="email" />}
      />
      <Controller
        name="fatherPhone"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Father's Phone No" placeholder="Enter Father's Phone No" />}
      />
      <Spacer y={2} className="col-span-1 md:col-span-2" />
      <h3 className="col-span-1 md:col-span-2">Mother's Details</h3>
      <Controller
        name="motherName"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Mother's Name" placeholder="Enter Mother's Name" />}
      />
      <Controller
        name="motherOccupation"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Mother's Occupation" placeholder="Enter Mother's Occupation" />}
      />
      <Controller
        name="motherEmail"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Mother's Email Address" placeholder="Enter Mother's Email" type="email" />}
      />
      <Controller
        name="motherPhone"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Mother's Phone No" placeholder="Enter Mother's Phone No" />}
      />
                  <Button type="submit"  variant="solid" color="primary" className="col-start-2 w-max ml-auto mr-10 mt-4">Save And Next</Button>


    </form>
  );
};

export default ParentsForm;