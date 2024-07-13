"use server";
import createSupabaseServerClient from "../supabase/server";
export default async function getUserSession(): Promise<{
  user: any;
  accessToken: string;
}> {
  const supabase = createSupabaseServerClient();
  const userP = supabase.auth.getUser();
  const sessionP = supabase.auth.getSession();

  return Promise.all([userP, sessionP])
    .then(
      ([
        { data },
        {
          data: { session },
        },
      ]) => {
        const user = {
          id: data.user?.id,
          email: data.user?.email,
        };
        return { user, accessToken: session?.access_token ?? "" };
      }
    )
    .catch((error) => {
      console.error("Error fetching user session:", error);
      return { user: null, accessToken: "" };
    });
}
