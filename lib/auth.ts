import { createClient } from '@supabase/supabase-js'
import { env } from "@/env.mjs"
import { supabase } from '@/utils/supabase/client';

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// 이메일로 로그인 처리
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// Google 공급자를 통한 OAuth 로그인 처리
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  })
  if (error) throw error;
  return { data };
}

// GitHub 공급자를 통한 OAuth 로그인 처리
export async function signInWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github'
  })
  if (error) throw error;
  return { data };
}

// 세션 검증 및 사용자 정보 가져오기
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data;
}

// 로그아웃 처리
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}