import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Session } from '@supabase/supabase-js';

export const useSendPasswordResetEmail = (session: Session | null) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendPasswordResetEmail = async (email: string, redirectTo?: string) => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectTo
        });

        if (error) {
            setError(error.message);
        }

        setLoading(false);
    };

    return {
        loading,
        error,
        sendPasswordResetEmail
    };
};

export default useSendPasswordResetEmail;