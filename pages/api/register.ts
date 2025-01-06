import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/initSupabase";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('hello there');
    if (req.method === 'POST') {
        console.log('method is post');
        const { username, password, expiration } = req.body;

        console.log('username: ', username);
        
        const { count, error: countError } =
            await supabase
            .schema('tootp_users')
            .from('users')
            .select('username', { count: 'exact', head: true })
            .eq('username', username);
        
        if (countError) {
            console.log('count error: ', countError);
            return res.status(500).json({ error: countError.message });
        }

        if (count > 0) {
            console.log('user already exists');
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('sending data to db');
        const { error } =
            await supabase
            .schema('tootp_users')
            .from('users')
            .insert([
                {
                    username: username,
                    password: hashedPassword,
                    totp_expiry: expiration
                }
            ]);
        
        if (error) {
            console.log('error while sending data to db: ', error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ message: 'User registered' });
    }
    else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
