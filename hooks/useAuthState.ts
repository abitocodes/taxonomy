import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase/client'; // supabase 클라이언트 경로에 맞게 조정해주세요.

type AuthStateHook = {
  loading: boolean;
  error: Error | null;
  user: User | null;
};

type AuthStateOptions = {
  onUserChanged?: (user: User | null) => Promise<void>;
};

export const useAuthState = (options?: AuthStateOptions): AuthStateHook => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const sessionResponse = await supabase.auth.getSession();
      setUser(sessionResponse.data.session?.user ?? null);
      setLoading(false);
  
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setLoading(false);
  
        if (options?.onUserChanged) {
          await options.onUserChanged(currentUser);
        }
      });
  
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
  
    initializeAuth();
  }, [options]);

  return { user, loading, error };
};

export default useAuthState;