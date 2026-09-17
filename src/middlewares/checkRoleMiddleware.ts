import { type Request, type Response, type NextFunction } from "express";
import { type CustomRequest, type User } from "../libs/types.js";

export const checkRoleMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  // get payload and token from (custom) request
  const user_id_in_params = req.params.userId as string;
	const user = req.user as User;
	
	// // validate user_id_in_params using zod
	
	console.log("user_id_in_params:", user_id_in_params);
	if (user && user.userId !== user_id_in_params) {
		return res.status(403).json({
			success: false,
			message: "Forbidden access",
		});
	}
  next();
};