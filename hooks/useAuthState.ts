import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';

import { supabase } from '@/utils/supabase/client';

type AuthStateHook = {
  loading: boolean;
  error: Error | null;
  user: User | null;
};

type AuthStateOptions = {
  onUserChanged?: (user: User | null) => Promise<void>;
};

export function useAuthState(session: Session | null, options?: AuthStateOptions): AuthStateHook {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(!session);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleAuthChange = async () => {
      setUser(session?.user ?? null);
      setLoading(false);

      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, updatedSession) => {
        const currentUser = updatedSession?.user ?? null;
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

    handleAuthChange();
  }, [session, options]);

  return { user, loading, error };
}