import { useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useSetRecoilState } from "recoil";

import { authModalState } from "@/atoms/auth/authModalAtom";
import { channelModalState } from "@/atoms/channelModalAtom";
import { Session } from '@supabase/supabase-js';
import { globalAuthState } from "@/atoms/globalAuthStateAtom";
import { useRecoilValue } from "recoil";

const useChannelModal = () => {
  const { globalSessionData, globalAuthLoadingState } = useRecoilValue(globalAuthState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const setChannelModalState = useSetRecoilState(channelModalState);

  const openModal = () => {
    // check for user to open supabase.auth modal before redirecting to submit
    if (!globalSessionData?.user?.id) {
      setAuthModalState(
        (prev) => ({ ...prev, emailInputModalOpen: true }));
      return;
    }

    setChannelModalState((prev) => ({ ...prev, open: true }));
  };

  const closeModal = () => {
    setChannelModalState((prev) => ({ ...prev, open: false }));
  };

  return { openModal, closeModal };
};

export default useChannelModal;
