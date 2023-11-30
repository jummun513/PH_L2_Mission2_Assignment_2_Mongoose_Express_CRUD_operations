import express, { Application, NextFunction, Request, Response } from 'express';
import { UserRoutes } from './modules/users/user.route';
import cors from 'cors';
const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// application routes
app.use('/api/users', UserRoutes);

// base routes
app.get('/', (req: Request, res: Response) => {
  res.send('Assignment - 2, server is running.');
});

// not found routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new Error('Your requested content was not found.'));
});

// Global error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error.message.includes('must be unique')) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  } else if (error.message == 'Your requested content was not found.') {
    res.status(404).json({
      success: false,
      message: 'Your requested content was not found.',
      error: {
        code: 404,
        description: 'Not found',
      },
    });
  }
});

export default app;
