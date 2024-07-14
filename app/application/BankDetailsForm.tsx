import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Spacer } from "@nextui-org/react";
import { ApplicantDetailsContext } from "@/context/applicantDetails/context"; import axios from "axios";
import { error } from "console";
import getUserSession from "@/lib/actions";
import { apiUrl } from "@/lib/env";

const BankDetailsForm = ({setTab} : {setTab:()=>void}) => {
  const context = React.useContext(ApplicantDetailsContext);

  if (!context) {
    throw new Error("useApplicantDetails must be used within an ApplicantDetailsContext");
  }

  const { bankDetails, setBankDetails } = context;
  const { control, handleSubmit, getValues , formState : {errors} } = useForm({
    defaultValues: {
    ...bankDetails
    }
  });

  const onSubmit = (data: any) => {
    setBankDetails(data);
  };
  const saveAndNext = async (data: any) => {
    const {accessToken} = await getUserSession();
    const {applicantId , ...dataToSend} = data;
    setBankDetails(data);
    await axios.post(`${apiUrl}/api/applicant/`,
      {
     bankDetails:dataToSend
    },{
      headers: {
        Authorization: `Bearer ${accessToken || ""}`,
        "Content-Type": "application/json",
      },

    }
  
  );
setTab();  };

  useEffect(() => {
    console.log("errors");
    return () => {
      console.log(errors);
      const values = getValues();
      onSubmit(values);
    };
  }, [errors]);

  return (
    <form onSubmit={handleSubmit(saveAndNext)} className="grid grid-cols-2 gap-7 p-5" >
      <Controller
        name="branch"
        control={control }
        rules={{ required: 'Branch is required', minLength: { value: 3, message: 'Branch must be at least 3 characters' } }}
        render={({ field }) => (
          <Input {...field} isRequired label="Branch" placeholder="Enter Branch" isInvalid={!!errors.branch} errorMessage={errors.branch?.message} value={field.value || ''}
           />
        )}
        
      />
      <Controller
        name="accountNo"
        rules={{ required: 'Branch is required', minLength: { value: 3, message: 'Branch must be at least 3 characters' } }}
        control={control}
        render={({ field }) => (
          <Input {...field} isRequired label="Account No" placeholder="Enter Account No" value={field.value || ''} />
        )}
      />
      <Controller
        name="ifscCode"
        rules={{ required: 'Branch is required', minLength: { value: 3, message: 'Branch must be at least 3 characters' } }}
        control={control}
        render={({ field }) => (
          <Input {...field} isRequired label="IFSC Code" placeholder="Enter IFSC Code" value={field.value || ''} />
        )}
      />
      <Spacer y={2} className="col-span-2" />
            <Button type="submit"  variant="solid" color="primary" className="col-start-2 w-max ml-auto mr-10 mt-4">Save And Next</Button>

      </form>
  );
};

export default BankDetailsForm;
