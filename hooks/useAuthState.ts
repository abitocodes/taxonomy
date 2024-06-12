import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { PublicUser } from '@prisma/client';
import { useRecoilState } from "recoil";
import { globalAuthState } from "@/atoms/globalAuthStateAtom";
import { GlobalAuthStateType } from "@/types/atoms/GlobalAuthStateType";

type AuthStateHook = {
  globalSession: Session | null;
  globalPublicUser: PublicUser | null;
  globalAuthLoadingState: boolean;
  globalAuthErrorMsg: Error | null;
};

type AuthStateOptions = {
  onSessionChanged?: (session: Session | null) => Promise<void>;
};

export function useAuthState(where: string, options?: AuthStateOptions): AuthStateHook {
  const [_globalAuthState, _setGlobalAuthState] = useRecoilState(globalAuthState);

  const handleAuthChange = async () => {
    
    console.log(`handleAuthChange Called(1/2) @${where}, globalAuthLoadingState: `, _globalAuthState.globalAuthLoadingState);
    console.log(`handleAuthChange Called(2/2) @${where}, globalAuthState: `, _globalAuthState);
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, updatedSession) => {
      const currentSession = updatedSession ?? null;

      if (currentSession) {
        const response = await fetch(`/api/getPublicUser?userId=${currentSession.user.id}`);
        const { publicUserData } = await response.json();
        _setGlobalAuthState((prev) => ({
          ...prev,
          globalSessionData: currentSession,
          globalPublicUserData: publicUserData
        }));
      } else {
        _setGlobalAuthState((prev) => ({
          ...prev,
          globalSessionData: null,
          globalPublicUserData: null
        }));
      }

      if (options?.onSessionChanged) {
        await options.onSessionChanged(currentSession);
      }

      _setGlobalAuthState((prev) => ({
        ...prev,
        globalAuthLoadingState: false
      }));
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  };

  useEffect(() => {
    handleAuthChange();
  }, [_globalAuthState.globalAuthLoadingState]);

  return { 
    globalSession: _globalAuthState.globalSessionData,
    globalPublicUser: _globalAuthState.globalPublicUserData,
    globalAuthLoadingState: _globalAuthState.globalAuthLoadingState, 
    globalAuthErrorMsg: _globalAuthState.globalAuthErrorMsg };
}

