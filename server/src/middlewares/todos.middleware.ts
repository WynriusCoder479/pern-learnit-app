import { NextFunction, Request, Response } from 'express'
import { TodoInput } from '../types/input'
import { TodoResponse } from '../types/response'

class TodosMiddleware {
	validateTodoInput(
		req: Request<{}, {}, TodoInput>,
		res: Response<TodoResponse>,
		next: NextFunction
	) {
		const { title } = req.body

		if (title === '')
			return res.status(400).json({
				success: false,
				message: 'Missing Data',
				errors: [
					{
						field: 'title',
						message: 'Title is required'
					}
				]
			})

		return next()
	}
}

const todosMiddlware = new TodosMiddleware()

export default todosMiddlware
