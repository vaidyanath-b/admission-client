if (!process.env.NEXT_PUBLIC_URL) {
  throw new Error("API_URL not found");
} else {
  console.log("API_URL found", process.env.NEXT_PUBLIC_API_URL);
}

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;
