// "use client"

// import { useEffect, useState } from "react";
// import { useAuthState } from "@/hooks/useAuthState";
// import { useRecoilState } from "recoil";

// import type { GetServerSidePropsContext, NextPage } from "next";
// import safeJsonStringify from "safe-json-stringify";

// import { userProfileState } from "@/atoms/userProfileAtom";
// import PageContentLayout from "@/components/reddit/Layout/PageContent";
// import AboutUser from "@/features/User/AboutUser";
// import UserNotFound from "@/features/User/UserNotFound";
// import CreatePostLink from "@/features/User/CreatePostLink";
// import Header from "@/features/User/Header";
// import Posts from "@/features/Post/Posts";
// import { User } from "@/types/userProfileState";

// import { Session } from '@supabase/supabase-js';

// export default function UserProfilePage ({ params }: { params: { user: string } }) {
//   const [session, setSession] = useState<Session | null>(null);
//   const { user, loading: loadingUser, error: authError } = useAuthState(session);
//   const [userProfileStateValue, setUserProfileStateValue] = useRecoilState(userProfileState);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await fetch(`/api/getUser?userId=${params.user}`);
//         const userData = await response.json();
//         if (response.ok) {
//           setUserProfileStateValue((prev) => ({
//             ...prev,
//             currentUser: userData,
//           }));
//         } else {
//           throw new Error(userData.error);
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     }
  
//     fetchData();
//   }, [params.user]);

//   // User was not found in the database
//   if (!userProfileStateValue.currentUser) {
//     return <UserNotFound />;
//   }

//   return (
//     <>
//       <Header userData={userProfileStateValue.currentUser} />
//       <PageContentLayout>
//         {/* Left Content */}
//         <>
//           <CreatePostLink />
//           <Posts userData={userProfileStateValue.currentUser} userId={user?.id} loadingUser={loadingUser} />
//         </>
//         {/* Right Content */}
//         <>
//           <AboutUser userData={userProfileStateValue.currentUser} />
//         </>
//       </PageContentLayout>
//     </>
//   );
// };