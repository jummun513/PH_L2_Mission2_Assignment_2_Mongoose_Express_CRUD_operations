import mongoose from 'mongoose';
import config from './config';
import app from './app';

async function main() {
  try {
    await mongoose.connect(config.database_uri as string);

    app.listen(config.port, () => {
      console.log(`Server is running at ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
