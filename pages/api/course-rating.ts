import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import prisma from '@/lib/prisma'
import { authOptions } from './auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { moduleId, courseId, rating } = req.body

  try {
    await prisma.courseRating.create({
      data: {
        moduleId,
        courseId,
        rating,
        userId: session.user.id,
      },
    })

    res.status(200).json({ message: 'Rating submitted successfully' })
  } catch (error) {
    console.error('Error submitting rating:', error)
    res.status(500).json({ message: 'Error submitting rating' })
  }
}