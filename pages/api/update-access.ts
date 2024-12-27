import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Try to find the user first
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Update existing user's access level
      await prisma.user.update({
        where: { email },
        data: { accessLevel: "STUDENT" },
      });
    } else {
      // Create new user with STUDENT access
      await prisma.user.create({
        data: {
          email,
          name: email.split("@")[0], // Use email prefix as name
          accessLevel: "STUDENT",
        },
      });
    }

    return res.status(200).json({ message: "Access granted successfully" });
  } catch (error) {
    console.error("Error updating access:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
