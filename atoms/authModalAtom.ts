import { atom } from 'recoil';
import { AuthModalState } from "@/types/AuthModalState";

export const authModalState = atom<AuthModalState>({
  key: 'authModalState',
  default: {
    open: false,
    view: 'login'
  },
});