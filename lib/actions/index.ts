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

 async function downloadFile(
  bucketName: string,
  filePath: string
): Promise<string | null> {
  try {
    const supabase = createSupabaseServerClient();
    const { data: d, error: e } = await supabase.storage
      .from(bucketName)
      .list();

    console.log("Files in bucket:", d);

    console.log("Downloading file", filePath, bucketName);
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (error) {
      throw error;
    }

    if (data) {
        return Buffer.from(await data.arrayBuffer()).toString("base64");
    }
  } catch (error) {
    console.error("Error downloading file:", error);
  }
  console.log("Error downloading file");
  return null;
}
