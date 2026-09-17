import express, { type Request, type Response } from "express";

// import middlewares
import morgan from "morgan";
import login from "./routes/usersRoutes.ts";
import items from "./routes/itemsRoutes.ts";
import invalidJsonMiddleware from "./middlewares/invalidJsonMiddleware.ts";
import notFoundMiddleware from "./middlewares/notFoundMiddleware.ts";
const app = express();
const port = 3000;

// body parser middleware
app.use(express.json());

// logger middleware
app.use(morgan("dev"));
// app.use(morgan("combined"));

// Endpoints
app.get("/", (req: Request, res: Response) => {
  res.send("Quiz #2 - API service");
});

app.get("/me", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Quiz #2 - API service",
  });
});

app.get("/student", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Student Information",
    data: {
      studentId: "680610682",
        firstName: "Thammasorn",
        lastName: "Meethiang",
        section: "001"
    }
  });
});

app.use("/api/v682/auth", login);
app.use("/api/v682/basket", items);

app.use(notFoundMiddleware);
app.use(invalidJsonMiddleware);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});



// Export app for vercel deployment
export default app;
