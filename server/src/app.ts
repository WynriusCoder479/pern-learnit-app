import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import router from './routes'
import { host, localhost, __prod__ } from './utils/constant'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(
	cors({
		origin: __prod__ ? host : localhost,
		credentials: true
	})
)

app.use('/api', router)

export default app
