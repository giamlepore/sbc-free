import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid comment ID" });
  }

  if (req.method === "PUT") {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    try {
      const comment = await prisma.comment.findUnique({
        where: { id },
      });

      if (!comment || comment.userId !== session.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const updatedComment = await prisma.comment.update({
        where: { id },
        data: { content },
        include: {
          user: true,
        },
      });
      return res.status(200).json(updatedComment);
    } catch (error) {
      console.error("Error updating comment:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while updating comment" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const comment = await prisma.comment.findUnique({
        where: { id },
      });

      if (!comment || comment.userId !== session.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await prisma.comment.delete({
        where: { id },
      });
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting comment:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while deleting comment" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
