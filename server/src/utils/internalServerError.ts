import { Response } from 'express'
import { IResponse } from '../types/response'

export const internalServerError = (error: any, res: Response<IResponse>) => {
	return res.status(500).json({
		success: false,
		message: `Internal server error: ${error}`
	})
}
