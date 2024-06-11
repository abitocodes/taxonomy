import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { SessionAndPublicUserStateType } from "@/types/atoms/SessionAndPublicUserStateType";
import { useRecoilState } from "recoil";
import { sessionAndPublicUserState } from "@/atoms/sessionAndUserAtom";

type AuthStateHook = {
  session: Session | null;
  setSession: (session: Session | null) => void;
  authLoadingState: boolean;
  authErrorMsg: Error | null;
};

type AuthStateOptions = {
  onUserChanged?: (user: User | null) => Promise<void>;
};

export function useAuthState(options?: AuthStateOptions): AuthStateHook {
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoadingState, setAuthLoadingState] = useState<boolean>(!session);
  const [authErrorMsg, setAuthErrorMsg] = useState<Error | null>(null);

  const [_sessionAndPublicUser, _setSessionAndPublicUser] = useRecoilState(sessionAndPublicUserState);

  useEffect(() => {
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
  
    const handleAuthChange = async () => {
      try {
        const { data } = supabase.auth.onAuthStateChange(async (event, updatedSession) => {
          const currentSession = updatedSession ?? null;
          const currentUser = currentSession?.user ?? null;
          
          setSessionUser(currentUser);
          setAuthLoadingState(false);
  
          if (options?.onUserChanged) {
            await options.onUserChanged(currentUser);
          }
        });
  
        authListener = data;
      } catch (error) {
        setAuthErrorMsg(error as Error);
      }
    };
  
    handleAuthChange();
  
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [sessionUser, options]);

  return { session, setSession, authLoadingState, authErrorMsg };
}