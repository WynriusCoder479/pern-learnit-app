import express from 'express'
import todosMiddlware from '../middlewares/todos.middleware'
import authMiddleware from '../middlewares/auth.middleware'
import todosController from '../controllers/todos.controller'

const todosRouter = express.Router()

todosRouter.post(
	'/create',
	authMiddleware.verifyAccessToken,
	todosMiddlware.validateTodoInput,
	todosController.createTodo
)

todosRouter.get(
	'/',
	authMiddleware.verifyAccessToken,
	todosController.readTodos
)

todosRouter.put(
	'/:todoId',
	authMiddleware.verifyAccessToken,
	todosMiddlware.validateTodoInput,
	todosController.updateTodo
)

todosRouter.delete(
	'/:todoId',
	authMiddleware.verifyAccessToken,
	todosController.deleteTodo
)

export default todosRouter
