"use client"
import { useEffect, useState } from "react";
import { AuthContext } from "./context";
import getUserSession from "@/lib/actions";
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";


export default function AuthState({ children }: { children: any }) {

   if(!process.env.NEXT_PUBLIC_URL){
         throw new Error("API_URL not found");
    }
  const [accessToken, setAccessToken] = useState("");
    const [user, setUser] = useState(null);
    const [axiosPriv , setAxiosPriv] = useState<AxiosInstance|null>(null);
    const [authLoading, setLoading] = useState(true);
    const [error, setError] = useState("");
    async function fetchUserSession() {
        try {
            const { user, accessToken } = await getUserSession();
            setAccessToken(accessToken);
            setUser(user);
            
        } catch (error:any) {
            setError(error.message);
        }
        setLoading(false);
    } 
    useEffect(() => {
        fetchUserSession();
    }, []);
    return (
        <AuthContext.Provider value={{ accessToken,axiosPriv, user ,setUser, authLoading }}>
            
            {
                authLoading ? (
                    <div>Loading...</div>
                ) : error ? (
                    alert(error)
                ) : (
                    children
                )
            }
        </AuthContext.Provider>
    );
}
