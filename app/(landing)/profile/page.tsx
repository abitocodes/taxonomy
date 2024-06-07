// "use client"

// import { useEffect, useState } from "react";
// import { useAuthState } from "@/hooks/useAuthState";
// import { useRecoilState } from "recoil";

// import type { GetServerSidePropsContext, NextPage } from "next";
// import safeJsonStringify from "safe-json-stringify";

// import { userState } from "@/atoms/userAtom";  // userProfileState 대신 userState 사용
// import PageContentLayout from "@/components/reddit/Layout/PageContent";
// import AboutUser from "@/features/User/AboutUser";
// import UserNotFound from "@/features/User/UserNotFound";
// import Header from "@/features/User/Header";
// import Posts from "@/features/Post/Posts";
// import { User } from "@/types/userProfileState";

// import { Session } from '@supabase/supabase-js';

// export default function myProfilePage ({ params }: { params: { user: string } }) {
//   const [session, setSession] = useState<Session | null>(null);
//   const { user, loading: loadingUser, error: authError } = useAuthState(session);
//   const [userStateValue, setUserStateValue] = useRecoilState(userState);  // userState 사용

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await fetch(`/api/getUser?userId=${params.user}`);
//         const userData = await response.json();
//         if (response.ok) {
//           setUserStateValue((prev) => ({
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
//   if (!userStateValue.currentUser) {
//     return <UserNotFound />;
//   }

//   return (
//     <>
//     <div id="profile" className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
//         <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto py-6 pr-2 md:sticky md:block lg:py-10">
//         </aside>
//         <main className="relative py-6 lg:gap-10 lg:py-10 xl:grid xl:grid-cols-[1fr_300px]">
//             <div id="center" className="mx-auto w-full min-w-0">
//                 <Posts userData={userStateValue.currentUser} userId={user?.id} loadingUser={loadingUser} />
//             </div>
//             <div id="right" className="fixed py-6 space-y-10 pr-4 top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto md:sticky md:block">
//                 <AboutUser userData={userStateValue.currentUser} />
//             </div>
//         </main>
//     </div>


//     </>
//   );
// };
