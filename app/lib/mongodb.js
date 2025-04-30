// import { MongoClient } from 'mongodb';

// const uri = process.env.MONGODB_URI;
// let client;
// let clientPromise;

// if (!uri) {
//   throw new Error('Please add your MongoDB URI to .env.local or Vercel environment variables');
// }

// // In production (Vercel), reuse the client across serverless invocations
// if (process.env.NODE_ENV === 'production') {
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri, {
//       maxPoolSize: 10, // Limit connection pool size
//       minPoolSize: 1,
//       connectTimeoutMS: 10000, // 10 seconds timeout
//       socketTimeoutMS: 45000, // 45 seconds socket timeout
//     });
//     global._mongoClientPromise = client.connect().catch((err) => {
//       console.error('MongoDB connection error:', err);
//       throw err;
//     });
//   }
//   clientPromise = global._mongoClientPromise;
// } else {
//   // In development, use a global variable to preserve the client across hot reloads
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri);
//     global._mongoClientPromise = client.connect().catch((err) => {
//       console.error('MongoDB connection error:', err);
//       throw err;
//     });
//   }
//   clientPromise = global._mongoClientPromise;
// }

// export default clientPromise;