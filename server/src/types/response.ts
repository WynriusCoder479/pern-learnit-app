import {
	BeAnObject,
	IObjectWithTypegooseFunction
} from '@typegoose/typegoose/lib/types'
import { Document } from 'mongoose'
import { Types } from 'mongoose'
import { Todo } from '../models/todo.model'
import { User } from '../models/user.model'

interface IResponse {
	success: boolean
	message?: string
}

interface FieldError {
	field: string
	message: string
}

type UserType = {
	_id: Types.ObjectId
	username: string
	email: string
	tokenVersion: number
}

type UserDocument = Document<Types.ObjectId, BeAnObject, User> &
	User &
	IObjectWithTypegooseFunction &
	Required<{
		_id: Types.ObjectId
	}>

type UserResponse = IResponse & {
	user?: UserType
	accessToken?: string
	errors?: FieldError[]
}

type TodoResponse = IResponse & {
	todo?: Omit<
		Document<any, BeAnObject, Todo> &
			Todo &
			IObjectWithTypegooseFunction & {
				_id: Types.ObjectId
			},
		never
	>
	todos?: Omit<
		Document<any, BeAnObject, Todo> &
			Todo &
			IObjectWithTypegooseFunction & {
				_id: Types.ObjectId
			},
		never
	>[]
	errors?: FieldError[]
}

export {
	IResponse,
	UserResponse,
	FieldError,
	UserType,
	UserDocument,
	TodoResponse
}
