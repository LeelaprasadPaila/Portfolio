import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDB from './config/database.js';
import errorHandler from './middlewares/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import bioRoutes from './routes/bioRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import internshipRoutes from './routes/internshipRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS config: allow frontend origin(s).
// In development, allow all origins (useful for local testing on localhost/127.0.0.1).
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_PROD_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || process.env.NODE_ENV === 'development' || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);


// Serve uploads folder
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bio', bioRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: '✓ Backend is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', error: true });
});

// Error handling
app.use(errorHandler);

// ====== Daily AI Knowledge Training (scheduled) ======
import cron from 'node-cron';
import { trainAIKnowledge } from './services/aiTrainer.js';

// Schedule daily training at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
  console.log('\n⏰ [CRON] Starting daily AI knowledge training...');
  console.log(`   ${new Date().toISOString()}`);
  
  try {
    const result = await trainAIKnowledge();
    console.log(`✅ [CRON] Daily training completed: v${result.version}`);
    console.log(`   Stats: ${JSON.stringify(result.stats)}`);
  } catch (error) {
    console.error('❌ [CRON] Daily training failed:', error.message);
  }
}, {
  scheduled: true,
  timezone: 'UTC'
});

console.log('📅 Daily AI training scheduled (midnight UTC)');

await connectDB();

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API Documentation:`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/health\n`);
});