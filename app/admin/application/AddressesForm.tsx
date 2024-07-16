import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Spacer } from "@nextui-org/react";
import axios from "axios";
import { Address } from "cluster";
import getUserSession from "@/lib/actions";
import { AdminApplicantContext } from "@/context/adminApplicantDetails/context";
import { apiUrl } from "@/lib/env";

const AddressesForm = ({setTab} : {setTab : () => void}) => {
  const context = React.useContext(AdminApplicantContext);

  if (!context) {
    throw new Error("useApplicantDetails must be used within an ApplicantDetailsContext");
  }

  const { applicationLoading, permanentAddress, setPermanentAddress, presentAddress, setPresentAddress, guardianAddress, setGuardianAddress,applicantId} = context;
  const { control, handleSubmit, getValues } = useForm({
    defaultValues: {
      permanentAddress,
      presentAddress,
      guardianAddress,
    }
  });

  const onSubmit = (data:any) => {
    setPermanentAddress(data.permanentAddress);
    setPresentAddress(data.presentAddress);
    setGuardianAddress(data.guardianAddress);
  };
  const saveAndNext = async(data:any) => {

    const {accessToken} = await getUserSession();
    try{
    console.log(data);
    setPermanentAddress(data.permanentAddress);
    setPresentAddress(data.presentAddress);
    setGuardianAddress(data.guardianAddress);
    const {applicantId:q , ...prData} = data.presentAddress;
     const {applicantId:p , ...pData} = data.permanentAddress
      const {applicantId:g , ...gData} = data.guardianAddress
    const res = await axios.post(`${apiUrl}/api/admin/applicant/${applicantId}`,
    {
      permanentAddress:pData,
      presentAddress:prData,
      guardianAddress:gData
    },      {
      headers: {
      Authorization: `Bearer ${accessToken || ""}`,
      "Content-Type": "application/json",
    },}
)
    console.log(res);
setTab();  }
  catch(err){
    console.error(err);
    alert("Error in saving data .please check form or contact staff");
  }
  };

  useEffect(() => {
    return () => {
      const values = getValues();
      onSubmit(values);
    };
  }, []);

  return (
    <form className="grid grid-cols-2 gap-7 p-5" onSubmit={handleSubmit(saveAndNext)}>
      <h1 className="col-span-2 font-bold text-2xl">Permanent Address</h1>
      <Controller
        name="permanentAddress.addressLines"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Permanent Address" placeholder="Enter Permanent Address" />}
      />
      <Controller
        name="permanentAddress.postOffice"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Post Office (PIN)" placeholder="Enter PIN" />}
      />
      <Controller
        name="permanentAddress.district"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="District" placeholder="Enter District" />}
      />
      <Controller
        name="permanentAddress.state"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="State" placeholder="Enter State" />}
      />

      <h3 className="col-span-2 font-bold text-2xl">Present Address</h3>
      <Controller
        name="presentAddress.addressLines"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Present Address" placeholder="Enter Present Address" />}
      />
      <Controller
        name="presentAddress.postOffice"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Post Office (PIN)" placeholder="Enter PIN" />}
      />
      <Controller
        name="presentAddress.district"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="District" placeholder="Enter District" />}
      />
      <Controller
        name="presentAddress.state"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="State" placeholder="Enter State" />}
      />

      <h3 className="col-span-2 font-bold text-2xl">Guardian Address</h3>
      <Controller
        name="guardianAddress.addressLines"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Guardian Address" placeholder="Enter Guardian Address" />}
      />
      <Controller
        name="guardianAddress.postOffice"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Post Office (PIN)" placeholder="Enter PIN" />}
      />
      <Controller
        name="guardianAddress.district"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="District" placeholder="Enter District" />}
      />
      <Controller
        name="guardianAddress.state"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="State" placeholder="Enter State" />}
      />
      <Controller
        name="guardianAddress.phoneNumber"
        control={control}
        render={({ field }) => <Input {...field} isRequired label="Phone number to contact in case of emergency" placeholder="Enter Contact No" />}
      />
      <Spacer y={2} className="col-span-2" />
            <Button type="submit"  variant="solid" color="primary" className="col-start-2 w-max ml-auto mr-10 mt-4">Save And Next</Button>

    </form>
  );
};

export default AddressesForm;
