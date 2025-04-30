// import jwt from 'jsonwebtoken';

// const generateAccessToken = (user) => {
//   return jwt.sign(
//     { user_id: user.user_id, email: user.email },
//     process.env.JWT_ACCESS_SECRET,
//     { expiresIn: '15m' } // Access token expires in 15 minutes
//   );
// };

// const generateRefreshToken = (user) => {
//   return jwt.sign(
//     { user_id: user.user_id, email: user.email },
//     process.env.JWT_REFRESH_SECRET,
//     { expiresIn: '7d' } // Refresh token expires in 7 days
//   );
// };

// const verifyAccessToken = (token) => {
//   try {
//     return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
//   } catch (error) {
//     throw new Error('Invalid access token', error);
//     return null;
//   }
// };

// const verifyRefreshToken = (token) => {
//   try {
//     return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
//   } catch (error) {
//     throw new Error('Invalid access token', error);
//     return null;
//   }
// };

// export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };