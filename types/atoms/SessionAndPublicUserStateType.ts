import { User } from "@supabase/supabase-js";
import { Session } from "@supabase/supabase-js";
import { PublicUser } from "@prisma/client";

export type SessionAndPublicUserStateType = {
  currentSessionData: Session | null;
  currentPublicUserData: PublicUser | null;
}

