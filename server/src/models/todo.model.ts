import { getModelForClass, Prop, Ref } from '@typegoose/typegoose'
import { status } from '../utils/constant'
import { User } from './user.model'

export class Todo {
	@Prop({ required: true })
	title!: string

	@Prop()
	description?: string

	@Prop()
	url?: string

	@Prop({ enum: status, default: status.TO_LEARN })
	status: status

	@Prop({ required: true, ref: () => User })
	user!: Ref<User>
}

export const todoModel = getModelForClass(Todo, {
	schemaOptions: {
		collection: 'todos',
		timestamps: true
	}
})
