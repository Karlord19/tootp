import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/initSupabase";
import bcrypt from "bcrypt";
import { authenticator } from "otplib";
import QRCode from "qrcode";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { username, password, totp_expiry } = req.body;

        if (!username || !password || !totp_expiry) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        if (totp_expiry < 4 || totp_expiry > 301) {
            return res.status(400).json({ error: 'TOTP expiry must be in range 5 to 300' });
        }
        
        const { count, error: countError } =
            await supabase
            .schema('tootp_users')
            .from('users')
            .select('username', { count: 'exact', head: true })
            .eq('username', username);
        
        if (countError) {
            return res.status(500).json({ error: countError.message });
        }

        if (count === null) {
            return res.status(500).json({ error: 'Error while determining username uniqueness' });
        }

        if (count > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        authenticator.options = { step: totp_expiry };
        const totpSecret = authenticator.generateSecret();

        const { data, error } =
            await supabase
            .schema('tootp_users')
            .from('users')
            .insert([
                {
                    username: username,
                    password: hashedPassword,
                    totp_secret: totpSecret,
                    totp_expiry: totp_expiry,
                }
            ])
            .select();
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (!data || data[0].id === undefined) {
            return res.status(500).json({ error: 'Error while registering user' });
        }

        await supabase
            .schema('tootp_users')
            .from('log')
            .insert([
                {
                    user_id: data[0].id,
                    message: 'register',
                    success: true,
                }
            ]);

        const otpauth = authenticator.keyuri(username, 'tootp', totpSecret);
        const qrCodeDataURL = await QRCode.toDataURL(otpauth);

        return res.status(200).json({ message: 'User registered', qrCodeDataURL });
    }
    else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
