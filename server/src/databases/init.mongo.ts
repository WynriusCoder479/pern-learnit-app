import mongoose from 'mongoose'

export const connectMongoDb = async () => {
	mongoose
		.set('strictQuery', true)
		.connect(process.env.DB_URL as string, err => {
			if (err) console.log(`An error occurred while connect to MongoDB: ${err}`)
			else console.log(`Connect to Mongo DB successfully`)
		})
}
