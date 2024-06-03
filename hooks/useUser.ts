import { PublicUser } from "@prisma/client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

export const useUser = () => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      console.log("useUser fetchSession data: ", data)

      const userId = data.session?.user?.id;

      if (userId) {
        const response = await fetch(`/api/getPublicUser?userId=${userId}`);
        console.log("getPublicUser response: ", response)
        const publicUser = await response.json();
        setUser(publicUser);
      } 

      setLoadingUser(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          const userId = session?.user?.id;
          if (userId) {
            const response = await fetch(`/api/getPublicUser?userId=${userId}`);
            console.log("getPublicUser response: ", response)
            const publicUser = await response.json();
            setUser(publicUser);
          } 
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoadingUser(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { user, loadingUser };
};

