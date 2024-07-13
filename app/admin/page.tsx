import AllotmentCountsTable from "@/components/SeatsInfo";
import ActiveApplicationsTable from "../../components/ApplicationsTable";

 const  Page = () => {
    return (
        <div className="flex flex-col gap-y-32">
            <ActiveApplicationsTable/>
            <h1 className="text-center text-[1.7rem] lg:text-[2.1rem] lg:text-5xl leading-9 tracking-tight font-semibold">
                Allotment Counts
            </h1>
            <AllotmentCountsTable/>
        </div>
    );
    }

    export default Page;