import express from 'express'
import authController from '../controllers/auth.controller'
import authMiddleware from '../middlewares/auth.middleware'

const authRouter = express.Router()

authRouter.get(
	'/refresh_token',
	authMiddleware.verifyRefreshToken,
	authController.getRefreshToken
)

export default authRouter
