"use server";
import getUserSession from "@/lib/actions";
import createSupabaseServerClient from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// export async function signUpWithEmailAndPassword(data: {
// 	email: string;
// 	password: string;
// 	confirm: string;
// }) {
// 	const supabase =  await createSupabaseServerClient();
// 	 const result = await supabase.auth.signUp({email: data.email, password: data.password});
// 	 return JSON.stringify(result);
// }
export async function signUpWithEmailAndPassword(data: {
  email: string;
  password: string;
  confirm: string;
}) {
  console.log(data);
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signUp(data);
  if (error) {
    console.log(error);
    redirect("/auth");
  }
}
export async function signInWithEmailAndPassword(data: {
  email: string;
  password: string;
}) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    alert("Invalid credentials");
    console.log(error);
    return false;
  }
  return true;
}
export async function Logout() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/auth");
}
