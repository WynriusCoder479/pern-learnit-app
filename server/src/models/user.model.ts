import { getModelForClass, Prop } from '@typegoose/typegoose'
import mongoose from 'mongoose'

export class User {
	@Prop({ auto: true })
	_id: mongoose.Types.ObjectId

	@Prop({ type: String, required: true, unique: true })
	username!: string

	@Prop({ type: String, required: true, unique: true })
	email!: string

	@Prop({ type: String, required: true })
	password!: string

	@Prop({ type: Number, required: true, default: 0 })
	tokenVersion!: number
}

export const userModel = getModelForClass(User, {
	schemaOptions: {
		collection: 'users',
		timestamps: true
	}
})
