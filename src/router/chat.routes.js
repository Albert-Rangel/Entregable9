import express, { Router } from "express"

const router = express.Router()

router.get("/", async (req, res) => {
    res.render("chat",{style: "chat.css"})
})

export default router
