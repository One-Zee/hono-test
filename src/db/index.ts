/* eslint-disable no-console */
import env from '@/env'
import mongoose from 'mongoose'

export default () => {
/**
 * Establishes a connection to the MongoDB database using the
 * connection string specified in the environment variables.
 * Logs a success message upon successful connection,
 * otherwise logs an error message and exits the process
 * in case of a connection failure.
 */
  const connect = () => {
    mongoose
      .connect(
        env.DB_URL,
      )
      .then(() => {
        return console.info(`Successfully connected to MongoDB...`)
      })
      .catch((error) => {
        console.error('Error connecting to database: ', error)
        // eslint-disable-next-line node/prefer-global/process
        return process.exit(1)
      })
  }
  connect()

  mongoose.connection.on('disconnected', connect)
}

// import mongoose from 'mongoose';
// import env from '@/env';

// export default () => {
//   const connect = () => {
//     mongoose
//       .connect(env.DB_URL)
//       .then(() => {
//         console.info(`Successfully connected to MongoDB...`);
//       })
//       .catch(error => {
//         console.error('Error connecting to database: ', error);
//         process.exit(1);  // Ensure the process exits if the connection fails
//       });
//   };

//   connect();

//   // Ensure that we don't add multiple 'disconnected' listeners
//   mongoose.connection.on('disconnected', () => {
//     console.warn('MongoDB disconnected. Attempting to reconnect...');
//     connect();  // Attempt to reconnect when the database connection is lost
//   });

//   // Handle connection errors
//   mongoose.connection.on('error', (err) => {
//     console.error('MongoDB connection error:', err);
//   });
// };
