const SUPABASE_FUNCTION_URL = "https://obrrhfnlfgqzexvszbjo.supabase.co/functions/v1/gemini-chat";

export const generateGeminiResponse = async (prompt, accessToken) => {

  try {
    if (!accessToken) throw new Error("User not authenticated");

    // 🔹 2. Call Supabase Edge Function
    const response = await fetch(SUPABASE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    console.log("supabase function response", data);

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    return data.reply;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
