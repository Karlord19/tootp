import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = parse(req.headers.cookie || '');
    const username = cookies['username'];

    if (!username) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(200).json({ username });
}
