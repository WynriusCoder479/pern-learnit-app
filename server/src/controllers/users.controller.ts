import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { RegisterInput } from '../types/input'
import userService from '../services/users.services'
import { UserDocument, UserResponse } from '../types/response'
import { internalServerError } from '../utils/internalServerError'
import jwt from '../utils/jwt'

class UsersController {
	register(req: Request<{}, {}, RegisterInput>, res: Response<UserResponse>) {
		try {
			userService.createUser(req.body).then(newUser => {
				const { password, ...user } = newUser.toObject()

				jwt.sendRefreshToken(newUser, res)

				return res.status(200).json({
					success: true,
					message: `User loged in successfully`,
					user,
					accessToken: jwt.createAccessToken(newUser)
				})
			})
		} catch (err) {
			throw internalServerError(err, res)
		}
	}

	login(_req: Request, res: Response<UserResponse, { user: UserDocument }>) {
		const { password, ...user } = res.locals.user.toObject()

		jwt.sendRefreshToken(res.locals.user, res)

		return res.status(200).json({
			success: true,
			message: `User loged in successfully`,
			user,
			accessToken: jwt.createAccessToken(res.locals.user)
		})
	}

	logout(
		req: Request<{ userId: Types.ObjectId }>,
		res: Response<UserResponse>
	) {
		const userId = req.params.userId

		try {
			userService.findUser({ _id: userId }).then(async existingUser => {
				if (!existingUser)
					return res.status(400).json({
						success: false,
						message: `User not found`
					})

				res.clearCookie(process.env.JWT_COOKIE as string, {
					httpOnly: true,
					secure: true,
					sameSite: 'lax'
				})

				existingUser.tokenVersion += 1

				await existingUser.save()

				return res.status(200).json({
					success: true,
					message: `User loged out successfully`
				})
			})
		} catch (err) {
			throw internalServerError(err, res)
		}
	}
}

const usersController = new UsersController()

export default usersController
