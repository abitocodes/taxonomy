'use client'

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from "@/utils/supabase/client";

export default function RouteGuard({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        authCheck(pathname);

        const handleRouteChange = () => {
            authCheck(pathname);
        };

        return () => {
            // 클린업 함수
        };
    }, [pathname]);

    async function authCheck(url) {
        const { data: { user }, error } = await supabase.auth.getUser();
        const publicPaths = ['/login'];
        const path = url.split('?')[0];

        if (!user && !publicPaths.includes(path)) {
            setAuthorized(false);
            router.push('/login');
        } else {
            setAuthorized(true);
        }
    }

    return authorized ? children : null;
}