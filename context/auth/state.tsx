"use client";
import { useEffect, useState } from "react";
import { AuthContext } from "./context";
import { createClient } from "@/lib/supabase/client";
import getUserSession from "@/lib/actions";
import { apiUrl } from "@/lib/env";
import {jwtDecode} from "jwt-decode";
import { Spinner } from "@nextui-org/react";

export default function AuthState({ children }: { children: any }) {

  if (!apiUrl) {
    throw new Error("API_URL not found");
  }

  const supabase = createClient()

  const [user, setUser] = useState(null);
  const [authLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const [authStateChanged , setAuthStateChanged] = useState(false); 

  async function fetchUserSession() {
    try {
        const { user, accessToken , role } = await getUserSession();
    
      setUser(user);
      setRole(role);
      console.log("\n\n\n\n " , user , "\n\n\n\n");
      if (accessToken) {
        console.log("decoded token", jwtDecode(accessToken));
      }
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    console.log("authState");
    fetchUserSession();
  }, [authStateChanged]);

  return (
    <AuthContext.Provider value={{ user, setUser, authLoading, role,setAuthStateChanged }}>
      {authLoading ? (
        <Spinner className="h-screen w-full self-center m-auto"color="danger"/>

      ) : error ? (
        alert(error)
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
