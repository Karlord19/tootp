import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/initSupabase";
import bcrypt from "bcrypt";
import { authenticator } from "otplib";
import QRCode from "qrcode";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { username, password, totp_expiry } = req.body;
        console.log('user wants totp expiry of', totp_expiry);
        
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
            return res.status(500).json({ error: 'Error counting users' });
        }

        if (count > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        authenticator.options = { step: totp_expiry };
        const totpSecret = authenticator.generateSecret();

        const { error } =
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
            ]);
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        const otpauth = authenticator.keyuri(username, 'tootp', totpSecret);
        const qrCodeDataURL = await QRCode.toDataURL(otpauth);

        return res.status(200).json({ message: 'User registered', qrCodeDataURL });
    }
    else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
