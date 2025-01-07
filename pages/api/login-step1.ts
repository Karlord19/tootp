import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/initSupabase";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        const { data: user, error } = await supabase
            .schema('tootp_users')
            .from('users')
            .select('id, username, password')
            .eq('username', username)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid username' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        return res.status(200).json({ userID: user.id });
    }
    else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}