import 'dotenv/config';
import app from './src/app';
import connectDB from './src/config/db';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

const start = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start().catch((err: Error) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
