import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Session } from '@supabase/supabase-js';
import { User } from '@supabase/supabase-js'; // User 타입을 임포트합니다.


export const useCreateUserWithEmailAndPassword = (session: Session | null) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userCred, setUserCred] = useState<User | null>(null);

    const createUserWithEmailAndPassword = async (email: string, password: string) => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        });

        if (error) {
            setError(error.message);
        } else {
            setUserCred(data.user);
        }

        setLoading(false);
    };

    return {
        loading,
        error,
        userCred,
        createUserWithEmailAndPassword
    };
};

export default useCreateUserWithEmailAndPassword;