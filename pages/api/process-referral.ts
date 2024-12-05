import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, referralCode } = req.body;

  if (!userId || !referralCode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { referredById: referralCode }
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing referral:', error);
    return res.status(500).json({ error: 'Failed to process referral' });
  }
}