import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { type CustomRequest, type UserPayload } from "../libs/types.js";

export const authenticateToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {

const authHeader = req.headers["authorization"];
	
	if(!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({
			success: false,
			message: "Authorization header is missing",
		});
	}
	
	const token = authHeader.split(" ")[1];
	if (!token) {
		return res.status(401).json({
			success: false,
			message: "Token is missing",
		});
	}
	
	
	try {
		const secretKey = process.env.JWT_SECRET_KEY || "mysecretkey";
		
		jwt.verify(token, secretKey, (err, user) => {
			if (err) {
				return res.status(403).json({
					success: false,
					message: "Forbidden Access",
				});
			}
			
			// attach user payload and token to request object
			req.user = user as UserPayload;
			req.token = token;
			
			next();
		});
		
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: "Something is wrong, please try again",
			error: err,
		});
	}
 
};

