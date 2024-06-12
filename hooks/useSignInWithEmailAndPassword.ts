import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { User, Session } from '@supabase/supabase-js';

const useSignInWithEmailAndPassword = (initialSession: Session | null) => {
    const [loading, setLoading] = useState(false);
    const [globalAuthErrorMsg, setAuthErrorMsg] = useState<string | null>(null);
    const [userCred, setUserCred] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(initialSession);

    const signInWithEmailAndPassword = async (email: string, password: string) => {
        setLoading(true);
        setAuthErrorMsg(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            setAuthErrorMsg(error.message);
        } else {
            setUserCred(data.user);
            setSession(data.session);
        }
        setLoading(false);
    };

    return {
        userCred,
        session,
        loading,
        globalAuthErrorMsg,
        signInWithEmailAndPassword
    };
};

export default useSignInWithEmailAndPassword;