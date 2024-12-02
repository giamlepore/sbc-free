import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { moduleId, courseId } = req.query
    
    try {
      const comments = await prisma.comment.findMany({
        where: { 
          moduleId: Number(moduleId), 
          courseId: Number(courseId) 
        },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      })

      const count = await prisma.comment.count({
        where: { 
          moduleId: Number(moduleId), 
          courseId: Number(courseId) 
        },
      })

      return res.status(200).json({ comments, count })
    } catch (error) {
      console.error('Error fetching comments:', error)
      return res.status(500).json({ error: 'An error occurred while fetching comments' })
    }
  } 
  
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { content, moduleId, courseId } = req.body
    
    if (!content || typeof moduleId !== 'number' || typeof courseId !== 'number') {
      return res.status(400).json({ error: 'Invalid request body' })
    }

    try {
      const comment = await prisma.comment.create({
        data: {
          content,
          moduleId,
          courseId,
          userId: session.user.id,
        },
        include: {
          user: true,
        },
      })
      return res.status(200).json(comment)
    } catch (error) {
      console.error('Error creating comment:', error)
      return res.status(500).json({ error: 'An error occurred while creating comment' })
    }
  } 

  return res.status(405).json({ message: 'Method not allowed' })
}