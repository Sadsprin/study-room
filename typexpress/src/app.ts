import express, { Request, Response, Application, NextFunction,ErrorRequestHandler } from 'express'
import createError from 'http-errors'

const app: Application = express()

app.get('/', (req: Request, res: Response) => {
	res.send("hello world");
})

app.use((req: Request, res: Response, next: NextFunction) => {
	const Error404 = new Error(`${req.path} is not found`);
	next(Error404)	
})

app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
	res.status(err.status || 500);

})

app.listen(4000, () => {
	console.log("Server start")
})
