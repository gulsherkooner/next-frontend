import clientPromise from '../../lib/mongodb.js';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../../lib/jwt.js';

const dbName = 'my-auth-app';
const collectionName = 'users';

// Validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

const validatePassword = (password) => {
  return password.length >= 8 && password.length <= 50;
};

const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
};

const validateOptionalString = (str, maxLength) => {
  return !str || (typeof str === 'string' && str.length <= maxLength);
};

export const registerUser = async (userData) => {
  console.log('Starting user registration');
  const startTime = Date.now();

  const client = await clientPromise;
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  const { email, username, password, display_name, bio, profile_img_url } = userData;

  // Input validation
  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }
  if (!validateUsername(username)) {
    throw new Error('Username must be 3-30 characters and contain only letters, numbers, or underscores');
  }
  if (!validatePassword(password)) {
    throw new Error('Password must be 8-50 characters long');
  }
  if (!validateOptionalString(display_name, 50)) {
    throw new Error('Display name must be 50 characters or less');
  }
  if (!validateOptionalString(bio, 500)) {
    throw new Error('Bio must be 500 characters or less');
  }
  if (!validateOptionalString(profile_img_url, 255)) {
    throw new Error('Profile image URL must be 255 characters or less');
  }

  // Check if user already exists
  const existingUser = await collection.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new Error('User with this email or username already exists');
  }

  // Hash password
  const password_hash = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = {
    user_id: Date.now().toString(), // Simple ID generation; consider UUID in production
    username,
    email,
    password_hash,
    display_name: display_name || '',
    bio: bio || '',
    profile_img_url: profile_img_url || '',
    created_at: new Date(),
    updated_at: new Date(),
    refreshToken: '',
  };

  const result = await collection.insertOne(newUser);
  console.log(result)
  console.log(`User registration completed in ${Date.now() - startTime}ms`);

  return { user_id: newUser.user_id, email: newUser.email };
};

export const loginUser = async ({ email, password }) => {
  console.log('Starting user login');
  const startTime = Date.now();

  const client = await clientPromise;
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  // Input validation
  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }
  if (!validatePassword(password)) {
    throw new Error('Password must be 8-50 characters long');
  }

  // Find user
  console.log('Querying user by email');
  const user = await collection.findOne(
    { email },
    {
      projection: {
        user_id: 1,
        username: 1,
        email: 1,
        password_hash: 1,
        display_name: 1,
        bio: 1,
        profile_img_url: 1,
        created_at: 1,
        updated_at: 1,
        refreshToken: 1,
        _id: 0,
      },
    }
  );
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  console.log('Verifying password');
  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  // Generate tokens
  console.log('Generating tokens');
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Store refresh token in MongoDB
  console.log('Updating refresh token');
  await collection.updateOne(
    { user_id: user.user_id },
    { $set: { refreshToken, updated_at: new Date() } }
  );

  // Remove sensitive fields from user object
  const { password_hash, refreshToken: storedRefreshToken, ...userData } = user;
  console.log(password_hash, storedRefreshToken, userData);

  console.log(`User login completed in ${Date.now() - startTime}ms`);
  return { accessToken, refreshToken, user: userData };
};

export const refreshUserToken = async (refreshToken) => {
  console.log('Starting token refresh');
  const startTime = Date.now();

  const client = await clientPromise;
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    throw new Error('Invalid or expired refresh token');
  }

  // Find user with refresh token
  const user = await collection.findOne({ user_id: decoded.user_id, refreshToken });
  if (!user) {
    throw new Error('Invalid refresh token');
  }

  // Generate new access token
  const newAccessToken = generateAccessToken(user);

  console.log(`Token refresh completed in ${Date.now() - startTime}ms`);
  return { accessToken: newAccessToken };
};