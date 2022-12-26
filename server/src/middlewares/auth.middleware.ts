import { NextFunction, Request, Response } from 'express'
import { Secret, verify } from 'jsonwebtoken'
import { Types } from 'mongoose'
import userService from '../services/users.services'
import { IResponse, UserDocument } from '../types/response'
import { UserAuthPayload } from '../types/userAuthPayload'
import { internalServerError } from '../utils/internalServerError'

class AuthMiddleware {
	verifyAccessToken(
		req: Request<{}, {}, {}>,
		res: Response<IResponse, { userId: Types.ObjectId }>,
		next: NextFunction
	) {
		const token = req.header('Authorization')?.split(' ')[1]

		if (!token)
			return res
				.status(401)
				.json({ success: false, message: `Token is missing` })

		try {
			const verifyToken = verify(
				token,
				process.env.ACCESS_TOKEN_SECRET as Secret
			) as UserAuthPayload

			res.locals.userId = verifyToken.userId

			return next()
		} catch (err) {
			throw internalServerError(err, res)
		}
	}

	verifyRefreshToken(
		req: Request<{}, {}, {}>,
		res: Response<IResponse, { user: UserDocument }>,
		next: NextFunction
	) {
		const token = req.cookies[process.env.JWT_COOKIE as string]

		if (!token)
			return res
				.status(401)
				.json({ success: false, message: `Refresh token is missing` })

		try {
			const verifyToken = verify(
				token,
				process.env.REFRESH_TOKEN_SECRET as Secret
			) as UserAuthPayload

			userService.findUser({ _id: verifyToken.userId }).then(existingUser => {
				if (!existingUser)
					return res
						.status(400)
						.json({ success: false, message: `User not found` })

				if (existingUser.tokenVersion !== verifyToken.tokenVersion)
					return res
						.status(400)
						.json({ success: false, message: `Invalid token` })

				res.locals.user = existingUser

				return next()
			})
		} catch (err) {
			throw internalServerError(err, res)
		}
	}
}

const authMiddleware = new AuthMiddleware()

export default authMiddleware
