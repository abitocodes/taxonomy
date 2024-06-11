import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { User, Session } from '@supabase/supabase-js';

type AuthStateHook = {
  sessionUser: User | null;
  authLoadingState: boolean;
  authError: Error | null;
};

type AuthStateOptions = {
  onUserChanged?: (user: User | null) => Promise<void>;
};

export function useAuthState(session: Session | null, options?: AuthStateOptions): AuthStateHook {
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const [authLoadingState, setAuthLoadingState] = useState<boolean>(true);
  const [authError, setAuthError] = useState<Error | null>(null);

  useEffect(() => {
    const handleAuthChange = async () => {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, updatedSession) => {
        const currentUser = updatedSession?.user ?? null;
        
        setSessionUser(currentUser);
        setAuthLoadingState(false);

        if (options?.onUserChanged) {
          await options.onUserChanged(currentUser);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    handleAuthChange();
  }, [session, options]);

  useEffect(() => {
    console.log("sessionUser: ", sessionUser)
    console.log("AAA useAuthState authLoadingState: ", authLoadingState)
  }, [authLoadingState])

  console.log(`useAuthState::authLoadingState ${authLoadingState}`)

  return { sessionUser, authLoadingState, authError };
}

