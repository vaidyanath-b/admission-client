
"use client"
import { useContext, useEffect, useState } from "react";
import { AdminContext, IActiveApplication, IAllotmentCount } from "./context";
import getUserSession from "@/lib/actions";
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";


export default function AdminState({ children }: { children: any }) {

    if(!process.env.NEXT_PUBLIC_URL){
          throw new Error("API_URL not found");
    }
    const [activeApplications, setActiveApplications] = useState<IActiveApplication[]>([]);
    const [allotmentCount, setAllotmentCount] = useState<IAllotmentCount[]>([]);
    const [authLoading, setLoading] = useState(true);
    const [error, setError] = useState("");
    async function fetchAdminData() {
        try {
            const {accessToken} = await getUserSession();
            const activeApplications = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/admin/applications`,{
                headers: {
                    Authorization: `Bearer ${accessToken || ""}`,
                    "Content-Type": "application/json",
                },
            
            });
            setActiveApplications(activeApplications.data);
            const allotmentCount = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/admin/allotment-count`,{
                headers: {
                    Authorization: `Bearer ${accessToken || ""}`,
                    "Content-Type": "application/json",
                },
            });
            setAllotmentCount(allotmentCount.data);
        } catch (error:any) {
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
                    <div>Loading...</div>
                ) : error ? (
                    alert(error)
                ) : (
                    children
                )
            }
        </AdminContext.Provider>
    );
}