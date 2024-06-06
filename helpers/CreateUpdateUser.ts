import { User } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

import { supabase } from "@/utils/supabase/client";

// ignore specific user properties
const replacer = (key: string, value: any) => {
  if (key !== "stsTokenManager") {
    return value;
  }
  return undefined;
};

export const CreateUpdateUser = async (user: User) => {
  const userData = JSON.parse(JSON.stringify(user, replacer));
  const { data, error } = await supabase
    .from('public_users')
    .upsert({ id: user.id, ...userData }, { onConflict: 'id' });

  if (error) throw error;
};