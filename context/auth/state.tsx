"use client"
import { useEffect, useState } from "react";
import { AuthContext } from "./context";
import getUserSession from "@/lib/actions";
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { apiUrl } from "@/lib/env";


export default function AuthState({ children }: { children: any }) {

   if(!apiUrl){
         throw new Error("API_URL not found");
    }
    const [user, setUser] = useState(null);
    const [authLoading, setLoading] = useState(true);
    const [error, setError] = useState("");
    async function fetchUserSession() {
        try {
            const { user, accessToken } = await getUserSession();
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
        <AuthContext.Provider value={{ user ,setUser, authLoading }}>
            
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
