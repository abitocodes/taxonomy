import { supabase } from '@/utils/supabase/client'
import { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // 로그인 처리
    const { email, password } = req.body
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    const user = data.user;
    const session = data.session;

    if (error) return res.status(401).json({ error: error.message })
    return res.status(200).json({ user, session })
  } else if (req.method === 'GET') {
    // 사용자 세션 확인
    const { data: session, error } = await supabase.auth.getSession()

    if (error) return res.status(401).json({ error: error.message })
    return res.status(200).json({ session })
  } else {
    // 허용되지 않은 메소드 처리
    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default handler