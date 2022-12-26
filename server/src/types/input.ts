import { Types } from 'mongoose'
import { status } from '../utils/constant'

interface RegisterInput {
	username: string
	email: string
	password: string
}

interface LoginInput {
	usernameOrEmail: string
	password: string
}

interface TodoInput {
	title: string
	description?: string
	url?: string
	status?: status
	user: Types.ObjectId
}

export { RegisterInput, LoginInput, TodoInput }
