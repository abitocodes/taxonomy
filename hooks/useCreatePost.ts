import { useAuthState } from "@/hooks/useAuthState"
import { useSetRecoilState } from "recoil";

import router from "next/router";

import { authModalState } from "@/atoms/authModalAtom";
import { supabase } from "@/utils/supabase/client";
import useDirectory from "@/hooks/useDirectory";

const useCreatePost = () => {
  console.log("useCreatePost called.");
  const { user, loading: authLoading, error: authError } = useAuthState();
  const setAuthModalState = useSetRecoilState(authModalState);
  const { toggleMenuOpen } = useDirectory();

  const onClick = () => {
    // check for user to open auth modal before redirecting to submit
    if (!user?.id) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    const { community } = router.query;
    if (community) {
      router.push(`/r/${router.query.community}/submit`);
      return;
    }
    // Open directory menu to select community to post to
    toggleMenuOpen();
  };

  return { onClick };
};

export default useCreatePost;
