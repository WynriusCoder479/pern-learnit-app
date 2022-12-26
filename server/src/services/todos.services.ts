import { Types } from 'mongoose'
import { todoModel } from '../models/todo.model'
import { TodoInput } from '../types/input'
import { status as StatusEnum } from '../utils/constant'

class TodosService {
	async createTodo(todoInput: TodoInput) {
		const { title, description, user, url } = todoInput

		const newTodo = new todoModel({
			title,
			description,
			url: url?.startsWith('https://') ? url : `https://${url}`,
			user
		})

		await newTodo.save()

		return newTodo
	}

	async findTodos(userId: Types.ObjectId, page?: number, limit?: number) {
		const todos = await todoModel.find(
			{ user: userId },
			{},
			page !== undefined && limit !== undefined
				? { skip: (page - 1) * limit, limit }
				: {}
		)

		return todos
	}

	async findTodo(todoId: Types.ObjectId) {
		const todo = await todoModel.find({ _id: todoId })

		return todo
	}

	async updateTodo(
		todoInput: TodoInput,
		todoId: Types.ObjectId,
		userId: Types.ObjectId
	) {
		const { title, description, url, status } = todoInput

		const todoUpdateConditon = { _id: todoId, user: userId }

		const updatedTodo = await todoModel.findByIdAndUpdate(
			todoUpdateConditon,
			{
				title,
				description: description || ' ',
				url: (url?.startsWith('https://') ? url : `https://${url}`) || ' ',
				status: status || StatusEnum.TO_LEARN
			},
			{ new: true }
		)

		return updatedTodo
	}

	async deleteTodo(todoId: Types.ObjectId, userId: Types.ObjectId) {
		const todoDeleteConditon = { _id: todoId, user: userId }

		const deletedTodo = await todoModel.findByIdAndDelete(todoDeleteConditon)

		if (deletedTodo) return true

		return false
	}
}

const todosService = new TodosService()

export default todosService
