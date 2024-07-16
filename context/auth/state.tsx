"use client";
import { useEffect, useState } from "react";
import { AuthContext } from "./context";
import { createClient } from "@/lib/supabase/client";
import getUserSession from "@/lib/actions";
import { apiUrl } from "@/lib/env";
import {jwtDecode} from "jwt-decode";

export default function AuthState({ children }: { children: any }) {

  if (!apiUrl) {
    throw new Error("API_URL not found");
  }

  const supabase = createClient()

  const [user, setUser] = useState(null);
  const [authLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");

  async function fetchUserSession() {
    try {
      const { user, accessToken } = await getUserSession();
      if (accessToken) {
        console.log("decoded token", jwtDecode(accessToken));
      }

      setUser(user);
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchUserSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user as any);
        const decodedToken = jwtDecode(session.access_token) as any
        setRole(decodedToken.user_role || "")
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Cleanup the listener on component unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, authLoading, role }}>
      {authLoading ? (
        <div>Loading...</div>
      ) : error ? (
        alert(error)
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
