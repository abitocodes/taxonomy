export type ModalView = "login" | "signup" | "resetPassword";

export type AuthModalState = {
  loginOpen: boolean;
  otpSent: boolean;
  view: ModalView;
};