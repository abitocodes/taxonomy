import { useEffect, useState } from 'react';
import { useAuthState } from "@/hooks/useAuthState"
import { useSetRecoilState } from "recoil";
import { useRouter, usePathname } from "next/navigation";
import { authModalState } from "@/atoms/authModalAtom";
import { useDirectory } from "@/hooks/useDirectory";
import { supabase } from '@/utils/supabase/client'; // supabase 클라이언트 경로에 맞게 조정해주세요.
import { Session } from '@supabase/supabase-js';

const useCreatePost = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: authLoading, error: authError } = useAuthState(session);
  const setAuthModalState = useSetRecoilState(authModalState);
  const { toggleMenuOpen } = useDirectory();
  const router = useRouter();
  const url = usePathname();

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Failed to fetch session:', error);
      } else {
        setSession(data.session);
      }
    };

    fetchSession();
  }, []);

  const onClick = () => {
    if (!user?.id) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    const genre = pathname?.get('genre');
    if (genre) {
      router.push(`/g/${genre}/submit`);
      return;
    }
    // Open directory menu to select genre to post to
    toggleMenuOpen();
  };

  return { onClick };
};

export default useCreatePost;