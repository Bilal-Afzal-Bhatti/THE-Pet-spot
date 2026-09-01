import type { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { User, type IUser } from "../models/userModel.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Single unified request interface
export interface AuthenticatedRequest extends Request {
  user?: IUser;
  file?: Express.Multer.File | undefined;
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | undefined;
}

export const sendTokenResponse = (
  user: IUser,
  statusCode: number,
  res: Response,
  message: string
) => {
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || "fallback_secret",
    { expiresIn: "7d" }
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? ("none" as const) : ("lax" as const),
  };

  const userObj = user.toObject();
  delete userObj.password;

  res.cookie("jwt", token, cookieOptions).status(statusCode).json({
    user: userObj,
    message,
  });
};

// Remove the explicit : RequestHandler type and cast the export at the end instead
export const protect = asyncHandler(
  async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    let token = req.cookies?.jwt;

    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError("Not authorized, please log in", 401);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret"
    ) as { id: string };

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError("The user belonging to this token no longer exists", 401);
    }

    req.user = user;
    next();
  }
) as unknown as RequestHandler;

// Alias export to satisfy routes importing authMiddleware
export const authMiddleware = protect;