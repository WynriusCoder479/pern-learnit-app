import express from 'express'
import usersController from '../controllers/users.controller'
import usersMiddleware from '../middlewares/users.middleware'

const usersRouter = express.Router()

usersRouter.post(
	'/register',
	usersMiddleware.validateRegisterInput,
	usersMiddleware.duplicatedUser,
	usersController.register
)

usersRouter.post(
	'/login',
	usersMiddleware.validatLoginInput,
	usersController.login
)

usersRouter.put('/logout/:userId', usersController.logout)

export default usersRouter
