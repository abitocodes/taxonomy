import { useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useSetRecoilState } from "recoil";

import { authModalState } from "@/atoms/authModalAtom";
import { communityModalState } from "@/atoms/communityModalAtom";
import { Session } from "@supabase/supabase-js";

const useCommunityModal = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: authLoading, error: authError } = useAuthState(session);
  const setAuthModalState = useSetRecoilState(authModalState);
  const setCommunityModalState = useSetRecoilState(communityModalState);

  const openModal = () => {
    // check for user to open supabase.auth modal before redirecting to submit
    if (!user?.id) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    setCommunityModalState((prev) => ({ ...prev, open: true }));
  };

  const closeModal = () => {
    setCommunityModalState((prev) => ({ ...prev, open: false }));
  };

  return { openModal, closeModal };
};

export default useCommunityModal;
