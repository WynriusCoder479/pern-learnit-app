import { Request, Response } from 'express'
import { Types } from 'mongoose'
import todosService from '../services/todos.services'
import { TodoInput } from '../types/input'
import { TodoResponse } from '../types/response'
import { internalServerError } from '../utils/internalServerError'

class TodosController {
	createTodo(
		req: Request<{}, {}, TodoInput>,
		res: Response<TodoResponse, { userId: Types.ObjectId }>
	) {
		try {
			todosService
				.createTodo({
					...req.body,
					user: res.locals.userId
				})
				.then(async newTodo => {
					const todo = await newTodo.populate('user', [
						'_id',
						'username',
						'email'
					])

					return res.status(201).json({
						success: true,
						message: `Create todo successfully`,
						todo
					})
				})
		} catch (err) {
			throw internalServerError(err, res)
		}
	}

	readTodos(
		req: Request<{}, {}, {}, { page: string; limit: string }>,
		res: Response<TodoResponse, { userId: Types.ObjectId }>
	) {
		const page = Number(req.query.page)
		const limit = Number(req.query.limit)

		try {
			todosService
				.findTodos(res.locals.userId, page, limit)
				.then(exisitingTodos => {
					return res.status(200).json({
						success: true,
						message: 'Read all todo successfully',
						todos: exisitingTodos
					})
				})
		} catch (err) {
			throw internalServerError(err, res)
		}
	}

	updateTodo(
		req: Request<{ todoId: Types.ObjectId }, {}, TodoInput>,
		res: Response<TodoResponse, { userId: Types.ObjectId }>
	) {
		try {
			todosService
				.updateTodo(req.body, req.params.todoId, res.locals.userId)
				.then(async updatedTodo => {
					if (!updatedTodo)
						return res.status(400).json({
							success: false,
							message: `Todo not found`
						})

					const todo = await updatedTodo.populate('user', [
						'_id',
						'username',
						'email'
					])

					return res.status(200).json({
						success: true,
						message: `Updated todo successfully`,
						todo
					})
				})
		} catch (err) {
			throw internalServerError(err, res)
		}
	}

	deleteTodo(
		req: Request<{ todoId: Types.ObjectId }>,
		res: Response<TodoResponse, { userId: Types.ObjectId }>
	) {
		try {
			todosService
				.deleteTodo(req.params.todoId, res.locals.userId)
				.then(isDeleted => {
					if (!isDeleted)
						return res.status(400).json({
							success: false,
							message: `Todo not found`
						})

					return res.status(200).json({
						success: true,
						message: `Deleted todo successfully`
					})
				})
		} catch (err) {
			throw internalServerError(err, res)
		}
	}
}

const todosController = new TodosController()

export default todosController
