"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "../supabase/server";
import { toast } from "sonner";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    console.log("Login error:", error);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
 const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  


  const { data: res, error } = await supabase.auth.signUp(data); 
  if (res?.user && res.user.identities && res.user.identities.length === 0) {
     return toast.error("This email is already registered with another provider. Please use a different email or sign in with the associated provider.");
  }
  if (error) {
    console.log("Signup error:", error);
  }

  if (res?.session) {
    await supabase.auth.signOut();
  }

  redirect("/authentication/login");

}