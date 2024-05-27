import { supabase } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

export const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: 'http://localhost:3000/auth/callback',
        },
      })
      
      if (data.url) {
        redirect(data.url) // use the redirect API for your server framework
      }
}

export const signUpWithEmailAndPassword = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        console.error('Error during sign up:', error);
        return null;
    }

    console.log('User signed up:', data.user);
    return data;
}

export const loginWithEmailAndPassword = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email as string,
        password: password as string
      });
    
      if (error) {
        console.error('Error during sign in:', error);
        return null;
      }
    
      console.log('User signed in, session token:', data.session.access_token);
      return data.session.access_token;  // 이 토큰을 사용하여 업데이트를 수행합니다.
}

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};