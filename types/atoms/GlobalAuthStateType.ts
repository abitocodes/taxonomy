import { User } from "@supabase/supabase-js";
import { Session } from "@supabase/supabase-js";
import { PublicUser } from "@prisma/client";

export type GlobalAuthStateType = {
  globalSessionData: Session | null;
  globalPublicUserData: any | null;
  globalAuthLoadingState: boolean;
  globalAuthErrorMsg: Error | null;
};
