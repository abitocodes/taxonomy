import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export const useSignInWithGoogle = (initialSession: Session | null) => {
    const [loading, setLoading] = useState(false);
    const [globalAuthErrorMsg, setAuthErrorMsg] = useState<string | null>(null);
    const [userCred, setUserCred] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(initialSession);

    const signInWithGoogle = async () => {
        setLoading(true);
        setAuthErrorMsg(null);
    
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google'
        });
    
        if (error) {
            setAuthErrorMsg(error.message);
        } else {
            window.location.href = data.url;
        }
        setLoading(false);
    };

    return {
        userCred,
        session,
        loading,
        globalAuthErrorMsg,
        signInWithGoogle
    };
};

export default useSignInWithGoogle;