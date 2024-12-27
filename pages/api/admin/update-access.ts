import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user || session.user.accessLevel !== "ADMIN") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    const { userId, accessLevel } = req.body;

    try {
      await prisma.user.update({
        where: { id: userId },
        data: { accessLevel },
      });
      return res.status(200).json({ message: "Access level updated" });
    } catch (error) {
      return res.status(500).json({ error: "Error updating access level" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
