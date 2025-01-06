import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/initSupabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Cache-Control', 'no-store');

    const { data, error } = await supabase
        .schema('tootp_users')
        .from('users')
        .select('username');
    
    if (error) {
        return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
}
