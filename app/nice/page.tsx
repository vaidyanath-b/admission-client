"use client"
import ApplicationsTable from '@/components/verificationTable';
import React from "react";
import { Card, CardBody, Image, Button } from "@nextui-org/react";

export default function Page(){
  return <ApplicationsTable/>
}
// const applicantData = {
//     id: "A12345",
//     name: "John Doe",
//     course: "Computer Science",
//     branch: "Software Engineering",
//     photoUrl: "/path/to/applicant/photo.jpg"
//   };

// export const ApplicantCard = ({ applicant }) => {
//   return (
//     <Card className="overflow-visible h-auto lg:h-[240px] dark:border-transparent rounded-sm">
//       <CardBody className="p-0 flex flex-row overflow-visible">
//         <div className="flex-none w-full sm:w-48 h-48 mb-6 sm:mb-0 relative z-10">
//           <Image
//             removeWrapper
//             alt={`${applicant.name}'s photo`}
//             className="object-cover absolute z-10 top-2 sm:left-2 inset-0 w-full h-full rounded-sm sm:scale-75 saturate-0"
//             src={applicant.photoUrl || "/default-applicant-photo.jpg"}
//           />
//         </div>
//         <div className="flex flex-col justify-center h-full ml-3">
//           <h2 className="text-xl font-mono font-thin text-foreground">{applicant.name}</h2>
//           <p className="my-2 text-base text-default-500 font-mono font-light">{applicant.course}</p>
//           <div className="flex flex-col gap-1">
//             <p className="text-sm font-mono font-light text-default-500">ID: {applicant.id}</p>
//             <p className="text-sm font-mono font-light text-default-500">Branch: {applicant.branch}</p>
//           </div>
//           <Button 
//             className="bg-foreground text-background text-sm font-normal rounded-sm mt-4"
//             size="sm"
//           >
//             Verify Documents
//           </Button>
//         </div>
//       </CardBody>
//     </Card>
//   );
// };export default function Page(){
//     // In your render method or functional component
//   return   <ApplicantCard applicant={applicantData} />
//  }