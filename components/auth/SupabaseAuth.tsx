"use client"

import React from 'react';
import { useAuthState } from "@/hooks/useAuthState";

const SupabaseAuth = () => {
  useAuthState("SupabaseAuth");

  return (
    <div>
    </div>
  );
};

export default SupabaseAuth;