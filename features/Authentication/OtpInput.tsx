import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import PinInput from "@/components/PinInput";
import { useRecoilState } from "recoil";
import { otpInputModalState } from "@/atoms/auth/otpInputModalAtom";
import { Session } from "@supabase/supabase-js";
import { OtpInputModalState } from "@/types/atoms/OtpInputModalState";

export const OtpInput = ({
    setOtpInputModalState,
    otpInputLoading,
    form,
    setForm,
    setFormError,
    setOtpInputLoading,
    setSession,
    handleOtpChange,
    _setAuthModalState,
    }) => {

    const [_otpInputModalState, _setOtpInputModalState] = useRecoilState(otpInputModalState);
        
    return (
    <Drawer
        open={_otpInputModalState.otpInputOpen} 
        onOpenChange={(otpInputOpen) => {
        setOtpInputModalState(prev => ({ ...prev, otpInputOpen }));
        }}>
        <DrawerTrigger asChild>
            <Button 
                className="w-full h-9 mt-2" 
                onClick={() => handleClickedOtpInputSubmitButton(_setOtpInputModalState, form, setFormError, setOtpInputLoading, setSession)}
                disabled={otpInputLoading}>
                {otpInputLoading ? <><ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>OTP 확인중</> : "OTP 요청"}
            </Button>
        </DrawerTrigger>
        <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                    <DrawerTitle>이메일을 확인하고, OTP 번호를 입력해주세요.</DrawerTitle>
                    <DrawerDescription>{form.email}</DrawerDescription>
                </DrawerHeader>
                <div className="flex items-center justify-center space-x-2">
                    <PinInput
                        length={6} 
                        initialValue=""
                        onChange={handleOtpChange} 
                        type="numeric" 
                        inputMode="numeric"
                        inputStyle={{borderColor: 'red'}}
                        inputFocusStyle={{borderColor: 'blue'}}
                        onComplete={(value, index) => {}}
                        autoSelect={true}
                        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                />
                </div>
                <DrawerFooter>
                    <Button onClick={() => handleClickedOtpInputSubmitButton(_setOtpInputModalState, form, setFormError, setOtpInputLoading, setSession)}>OTP 확인</Button>
                    <DrawerClose asChild>
                        <Button variant="outline" onClick={() => _setOtpInputModalState(prev => ({ ...prev, otpInputOpen: !prev.otpInputOpen }))}>취소</Button>
                    </DrawerClose>
                </DrawerFooter>
            </div>
        </DrawerContent>
    </Drawer>
);}

const handleClickedOtpInputSubmitButton = (
    setOtpInputModalState: (otpInputModalState: OtpInputModalState) => void,
    form: any,
    setFormError: (error: string) => void,
    setOtpInputLoading: (loading: boolean) => void,
    setSession: (session: Session) => void,
    ) => {

    if(form.otp.length === 6) {
        setOtpInputModalState({ otpInputOpen: true, view: "otpInput", otpEntered: false })
        verifyOTP(form, setFormError, setOtpInputLoading, setSession);
    } else {
        setFormError("OTP 번호를 입력해주세요.");
    }
  };
  
const verifyOTP = async (form, setFormError, setOtpInputLoading, setSession) => {
    setOtpInputLoading(false);
    // const otp = form.otp
    // const { data, error } = await supabase.auth.verifyOtp({
    //   email: form.email,
    //   token: otp.join(''),
    //   type: 'email'
    // });
    // if (error) {
    //   setFormError(error.message);
    //   setOtpInputLoading(false);
    // } else {
    //   setSession(data.session);
    //   CreateUpdateUser(data.user as User);
    //   setOtpInputLoading(false);
    // }
};