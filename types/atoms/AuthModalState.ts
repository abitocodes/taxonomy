export type ModalView = "login" | "signup" | "resetPassword";

export type AuthModalState = {
  open: boolean;
  otpSent: boolean;
  view: ModalView;
};
