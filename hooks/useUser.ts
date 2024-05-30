import { PublicUser } from "@prisma/client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

export const useUser = () => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      const userId = data.session?.user?.id;

      if (userId) {
        const publicUser = await fetchUserDetails(userId);
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
            const publicUser = await fetchUserDetails(userId);
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

async function fetchUserDetails (userId: string) {
  const { data: userData, error } = await supabase
    .from('public_users')
    .select('*')
    .eq('id', userId);

  if (error) {
    console.error('Error fetching user details:', error.message);
  } else {
    console.log('User details:', userData);
    return userData[0];
  }
};

