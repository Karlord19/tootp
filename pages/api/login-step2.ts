import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/initSupabase";
import { serialize } from "cookie";
import { authenticator } from "otplib";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { userID, totpCode } = req.body;

        if (!userID || !totpCode) {
            return res.status(400).json({ error: 'Missing user ID or TOTP code' });
        }

        const { data: user, error } = await supabase
            .schema('tootp_users')
            .from('users')
            .select('id, username, totp_secret, totp_expiry')
            .eq('id', userID)
            .single();
        
        if (error || !user) {
            return res.status(401).json({ error: error.message });
        }

        authenticator.options = { step: parseInt(user.totp_expiry) };
        const isTotpValid = authenticator.verify({ token: totpCode, secret: user.totp_secret });

        await supabase
            .schema('tootp_users')
            .from('log')
            .insert([
                {
                    user_id: user.id,
                    message: 'login via TOTP',
                    success: isTotpValid,
                }
            ]);
        
        if (!isTotpValid) {
            return res.status(401).json({ error: 'Invalid TOTP code.' });
        }

        res.setHeader('Set-Cookie', serialize('username', user.username, { path: '/'}));

        return res.status(200).json({ message: 'Login successful' });
    }
    else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
