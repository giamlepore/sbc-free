import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId } = req.query

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'User ID is required' })
    }

    try {
      const referrals = await prisma.user.findMany({
        where: {
          referredById: userId
        },
        select: {
          name: true,
          email: true
        }
      })

      const hasAccess = referrals.length >= 3

      const referralsWithDate = referrals.map(referral => ({
        ...referral,
        createdAt: new Date()
      }))

      return res.status(200).json({
        referrals: referralsWithDate,
        hasAccess
      })
    } catch (error) {
      console.error('Error fetching referrals:', error)
      return res.status(500).json({ error: 'Failed to fetch referrals' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}