import express, { Application, Request, Response } from 'express';
const app: Application = express();

// parsers
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world');
});

export default app;
