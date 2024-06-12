import { useEffect, useState } from 'react';
import { useAuthState } from "@/hooks/useAuthState"
import { useSetRecoilState } from "recoil";
import { useRouter, usePathname } from "next/navigation";
import { authModalState } from "@/atoms/auth/authModalAtom";
import { useDirectory } from "@/hooks/useDirectory";
import { supabase } from '@/utils/supabase/client'; // supabase 클라이언트 경로에 맞게 조정해주세요.
import { Session } from '@supabase/supabase-js';
import { globalAuthState } from "@/atoms/globalAuthStateAtom";
import { useRecoilValue } from "recoil";

const useCreatePost = () => {
  const { globalSessionData, globalAuthLoadingState } = useRecoilValue(globalAuthState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const { toggleMenuOpen } = useDirectory();
  const router = useRouter();
  const url = usePathname();

  const onClick = () => {
    if (!globalSessionData?.user?.id) {
      setAuthModalState((prev) => ({
        ...prev,
        emailInputModalOpen: true,
      }));
      return;
    }

    const channel = url?.split('/')[3];
    if (channel) {
      router.push(`/ch/${channel}/submit`);
      return;
    }
    // Open directory menu to select channel to post to
    toggleMenuOpen();
  };

  return { onClick };
};

export default useCreatePost;