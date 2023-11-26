import mongoose from 'mongoose';
import config from './config';
import app from './app';

async function main() {
  try {
    await mongoose
      .connect(config.database_uri as string)
      .then(() => console.log('MongoDB successfully connected.'))
      .catch((err) => console.log(err));

    app.listen(config.port, () => {
      console.log(`Server is running at ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
