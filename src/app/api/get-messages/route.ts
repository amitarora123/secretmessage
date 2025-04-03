import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import { Types } from "mongoose";

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user;
    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        { status: 401 }
      );
    }
    const userId = user._id;
    await UserModel.findById(userId);

    const newUser = await UserModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(userId),
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
    ]);

    if (!newUser || newUser.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No messages found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        messages: newUser[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("failed to get messages ", error);
    return Response.json(
      {
        success: false,
        message: "failed to get messages",
      },
      { status: 500 }
    );
  }
}
