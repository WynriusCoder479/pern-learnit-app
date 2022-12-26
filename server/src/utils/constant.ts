const __prod__ = process.env.NODE_ENV === 'production'

const host = ''
const localhost = 'http://localhost:3000'

enum status {
	TO_LEARN = 'To learn',
	LEARNING = 'Learning',
	LEARNED = 'Learned'
}

export { __prod__, host, localhost, status }
