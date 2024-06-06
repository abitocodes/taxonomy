import { supabase } from "@/utils/supabase/client";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const email = url.searchParams.get('email') || undefined;  // null 대신 undefined 사용
    const otp = url.searchParams.get('otp') || undefined;     // null 대신 undefined 사용

    console.log("verifyOtp email: ", email);
    console.log("verifyOtp otp: ", otp);

    try {

        if (!email || !otp) {
            return new Response(JSON.stringify({
                statusCode: 400,
                message: 'Email or OTP missing',
            }), { status: 400 });
        }

        const { data, error } = await supabase.auth.verifyOtp({
            email: email,
            token: otp,
            type: 'email'
        });

        if (error) throw error;

        if (!data) {
            return new Response(JSON.stringify({
                statusCode: 404,
                message: 'Invalid OTP',
            }), { status: 404 });
        }

        return new Response(JSON.stringify({
            statusCode: 200,
            message: '200 OK',
            data: data
        }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({
            statusCode: 500,
            message: 'An error occurred while verifying OTP'
        }), { status: 500 });
    }
}