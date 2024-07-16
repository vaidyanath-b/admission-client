
"use client"
import { useContext, useEffect, useState } from "react";
import { AdminContext, IActiveApplication, IAllotmentCount } from "./context";
import getUserSession from "@/lib/actions";
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { apiUrl } from "@/lib/env";
import { jwtDecode } from "jwt-decode";
import { redirect, useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/react";


export default function AdminState({ children }: { children: any }) {

    if(!apiUrl){
          throw new Error("API_URL not found");
    }
    const router = useRouter();
    const [activeApplications, setActiveApplications] = useState<IActiveApplication[]>([]);
    const [allotmentCount, setAllotmentCount] = useState<IAllotmentCount[]>([]);
    const [authLoading, setLoading] = useState(true);
    const [error, setError] = useState("");
    async function fetchAdminData() {
        setLoading(true)
        try {
            const {accessToken} = await getUserSession();
            if(accessToken){
                const {user_role} = jwtDecode(accessToken) as any;
                if(user_role == "APPLICANT"){
                     router.push('/application')
                     return
                }
            }
            const activeApplications = await axios.get(`${apiUrl}/api/admin/applications`,{
                headers: {
                    Authorization: `Bearer ${accessToken || ""}`,
                    "Content-Type": "application/json",
                },
            
            });
            setActiveApplications(activeApplications.data);
            const allotmentCount = await axios.get(`${apiUrl}/api/admin/allotment-count`,{
                headers: {
                    Authorization: `Bearer ${accessToken || ""}`,
                    "Content-Type": "application/json",
                },
            });
            setAllotmentCount(allotmentCount.data);
        } catch (error:any) {
            setLoading(false)
            setError(error.message);
        }
        setLoading(false);
    } 
    useEffect(() => {
        fetchAdminData();
    }, []);
    return (
        <AdminContext.Provider value={{ activeApplications,allotmentCount, setAllotmentCount,setActiveApplications }}>
            
            {
                authLoading ? (
                    <Spinner className="h-screen w-full self-center m-auto"color="danger" />
                ) : error ? (
                    alert(error)
                ) : (
                    children
                )
            }
        </AdminContext.Provider>
    );
}