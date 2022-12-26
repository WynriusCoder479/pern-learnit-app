import { validate } from 'email-validator'
import { NextFunction, Request, Response } from 'express'
import userService from '../services/users.services'
import { UserResponse, FieldError, UserDocument } from '../types/response'
import { internalServerError } from '../utils/internalServerError'
import argon2 from 'argon2'
import { RegisterInput, LoginInput } from '../types/input'

class UsersMiddleware {
	validateRegisterInput(
		req: Request<{}, {}, RegisterInput>,
		res: Response<UserResponse>,
		next: NextFunction
	) {
		const { username, email, password } = req.body

		const passwordPartern =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

		if (Object.values(req.body).some(data => data === ''))
			return res.status(400).json({
				success: false,
				message: `Missing data`,
				errors: (
					Object.entries(req.body).map<FieldError | undefined>(data =>
						data[1] === ''
							? {
									field: `${data[0]}`,
									message: `${
										data[0].charAt(0).toUpperCase().toString() +
										data[0].substring(1).toString
									} is required`
							  }
							: undefined
					) as FieldError[]
				).filter(data => data === undefined)
			})

		if (username.length <= 4 || validate(username))
			return res.status(400).json({
				success: false,
				message: `Invalid username`,
				errors: [
					{
						field: 'username',
						message: `User name must be 4 or greater and not include "@" character`
					}
				]
			})

		if (!validate(email))
			return res.status(400).json({
				success: false,
				message: `Invalid email`,
				errors: [
					{
						field: 'email',
						message: 'Email wrong form'
					}
				]
			})

		if (!passwordPartern.test(password))
			return res.status(400).json({
				success: false,
				message: `Invalid password`,
				errors: [
					{
						field: 'password',
						message: `Password must be greater than 8, at least one uppercase letter, at least one digit, and at least one special charactor`
					}
				]
			})

		return next()
	}

	duplicatedUser(
		req: Request<{}, {}, RegisterInput>,
		res: Response<UserResponse>,
		next: NextFunction
	) {
		const { username, email } = req.body

		try {
			userService.findUser({ username, email }).then(exintingUser => {
				if (exintingUser)
					return res.status(400).json({
						success: false,
						message: `Duplicated user`,
						errors:
							exintingUser.username === username || exintingUser.email === email
								? [
										{
											field: 'username',
											message: `Username is already taken`
										},
										{
											field: 'email',
											message: `Email is already taken`
										}
								  ]
								: exintingUser.username === username
								? [
										{
											field: 'username',
											message: `Usernamr is already taken`
										}
								  ]
								: [
										{
											field: 'email',
											message: `Email is already taken`
										}
								  ]
					})

				return next()
			})
		} catch (err) {
			throw internalServerError(err, res)
		}
	}

	validatLoginInput(
		req: Request<{}, {}, LoginInput>,
		res: Response<UserResponse, { user: UserDocument }>,
		next: NextFunction
	) {
		const { usernameOrEmail, password: inputPassword } = req.body

		try {
			if (Object.values(req.body).some(data => data === ''))
				return res.status(400).json({
					success: false,
					message: `Missing data`,
					errors: (
						Object.entries(req.body).map<FieldError | undefined>(data =>
							data[1] === ''
								? {
										field: `${data[0]}`,
										message: `${
											data[0].charAt(0).toUpperCase().toString() +
											data[0].substring(1).toString
										} is required`
								  }
								: undefined
						) as FieldError[]
					).filter(data => data === undefined)
				})

			userService
				.findUser(
					validate(usernameOrEmail)
						? { email: usernameOrEmail }
						: { username: usernameOrEmail }
				)
				.then(async existingUser => {
					if (!existingUser)
						return res.status(400).json({
							success: false,
							message: `User not found`,
							errors: [
								{
									field: validate(usernameOrEmail) ? 'email' : 'username',
									message: `${
										validate(usernameOrEmail) ? 'Email' : 'Username'
									} is incorrect`
								}
							]
						})
					const verifyPassword = await argon2.verify(
						existingUser.password,
						inputPassword
					)

					if (!verifyPassword)
						return res.status(400).json({
							success: false,
							message: `Wrong password`,
							errors: [
								{
									field: 'password',
									message: `Password is incorrect`
								}
							]
						})

					res.locals.user = existingUser

					return next()
				})
		} catch (err) {
			throw internalServerError(err, res)
		}
	}
}

const usersMiddleware = new UsersMiddleware()

export default usersMiddleware
