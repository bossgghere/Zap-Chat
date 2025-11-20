import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'ZapChat API is running! ⚡' });
});

// Test user creation route
app.get('/test-user', async (req, res) => {
  try {
    const testUser = await User.create({
      username: 'snaplay',
      email: 'snaplay@zapchat.com',
      password: '123456',
    });
    
    res.json({ 
      message: 'User created successfully!', 
      user: testUser 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();