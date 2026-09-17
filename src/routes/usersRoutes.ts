import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

import type { User, CustomRequest } from "../libs/types.js";

// import authentication middleware
import { authenticateToken } from "../middlewares/authenMiddleware.ts";

// import database
import { users } from "../db/db.ts";

const router = Router();

// POST /api/vXXX/auth/login
router.post("/login", (req: Request, res: Response) => {
  try {
    const { username,password } = req.body;
    const user = users.find((u) => u.username === username && u.password === password);

    // 2. check if user exists (search with username & password in DB)
    if(!user){
        return res.status(404).json({
            success: false,
            message: "Username or Password is incorrect"
        })
    }    

    // 3. create JWT token (with user info object as payload) using JWT_SECRET_KEY
        const jwt_secret = process.env.jwt_secret || "this_is_my_secret";
        const token = jwt.sign(
        {
            //app payload
            username: user.username,
            password: user.password,
            userId: user.userId
        },
        jwt_secret,
        {expiresIn:"10m"}
    )
    //    (optional: save the token as part of User data)
 
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: token
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err
    });
  }
});

// POST /api/vXXX/auth/logout
router.post("/logout", authenticateToken, (req: Request, res: Response) => {
  try {
    const payload = (req as any).user;
    const token = (req as any).token;

    // find user by payload.username
    const user = users.find((u: User) => u.username === payload.username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    // check if token exists in user.tokens
    if (!user.tokens || !user.tokens.includes(token)) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // if token exists, remove the token from user.tokens
    user.tokens = user.tokens?.filter((t) => t !== token);
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

// POST /api/vXXX/auth/reset
// router.post("/reset", (req: Request, res: Response) => {
//   try {
//     reset_users();
//     return res.status(200).json({
//       success: true,
//       message: "User database has been reset",
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "Something is wrong, please try again",
//       error: err,
//     });
//   }
// });

export default router;