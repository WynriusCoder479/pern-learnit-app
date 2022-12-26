import { createServer } from 'http'
import app from './app'
import dotenv from 'dotenv'
import { connectMongoDb } from './databases/init.mongo'

dotenv.config()

const server = async () => {
	const PORT = process.env.PORT || 4000

	const httpServer = createServer(app)

	await new Promise<void>(resolve => httpServer.listen({ port: PORT }, resolve))
		.then(_ => console.log(`Http server starting on port ${PORT}`))
		.catch(err =>
			console.log(`An error occurred while staring http server: ${err}`)
		)

	connectMongoDb()
}

server().catch(err => console.log(`Initialize server error: ${err}`))
