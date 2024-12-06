import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Buscar total de usuários
    const totalUsers = await prisma.user.count()

    // Buscar total de conclusões de cursos
    const totalCompletions = await prisma.courseCompletion.count()

    return res.status(200).json({
      totalUsers,
      totalCompletions
    })
  } catch (error) {
    console.error('Error fetching platform stats:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}