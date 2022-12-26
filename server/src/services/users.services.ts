import { FilterQuery } from 'mongoose'
import { User, userModel } from '../models/user.model'
import argon2 from 'argon2'
import { RegisterInput } from '../types/input'

class UserServices {
	async createUser(registerInput: RegisterInput) {
		const { username, email, password } = registerInput

		const newUser = new userModel({
			username,
			email,
			password: await argon2.hash(password)
		})

		await newUser.save()

		return newUser
	}

	async findUser(filter: FilterQuery<User>) {
		const user = await userModel.findOne(filter)

		return user
	}
}

const userService = new UserServices()

export default userService
