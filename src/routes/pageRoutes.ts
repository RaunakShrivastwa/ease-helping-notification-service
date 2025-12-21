import { Router } from "express";

const router = Router();

router.get("/auth", (_, res) => {
  res.render("auth");
});

router.get("/health", (_, res) => {
  res.send("Notification service OK");
});

export default router;
