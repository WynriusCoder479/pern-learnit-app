import { Request, Response } from 'express'
import { UserDocument, UserResponse } from '../types/response'
import jwt from '../utils/jwt'

class AuthController {
	getRefreshToken(
		_req: Request,
		res: Response<UserResponse, { user: UserDocument }>
	) {
		jwt.sendRefreshToken(res.locals.user, res)

		return res.status(200).json({
			success: true,
			message: `Refresh token successfully`,
			accessToken: jwt.createAccessToken(res.locals.user)
		})
	}
}

const authController = new AuthController()

export default authController
