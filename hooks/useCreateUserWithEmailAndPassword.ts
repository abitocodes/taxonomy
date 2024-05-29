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

        // 세션을 사용하는 로직을 여기에 추가합니다.
        // 예시로, 세션 정보를 로그로 출력하거나, 세션을 사용하는 API 호출을 할 수 있습니다.
        console.log('Current session:', session);

        // 여기에 Firebase 또는 Supabase를 사용한 사용자 생성 로직을 구현합니다.
        // 예시로 Supabase의 auth.signUp을 사용합니다.
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