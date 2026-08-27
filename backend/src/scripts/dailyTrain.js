/**
 * Daily AI Knowledge Training Script
 * Can be triggered via cron job or npm script.
 * 
 * Usage:
 *   node src/scripts/dailyTrain.js
 * 
 * For scheduled daily runs, add to crontab:
 *   0 0 * * * cd /path/to/backend && node src/scripts/dailyTrain.js
 */

import { trainAIKnowledge } from '../services/aiTrainer.js';
import connectDB from '../config/database.js';

const run = async () => {
  console.log('\n⏰ Daily AI Knowledge Training Started');
  console.log(`   ${new Date().toISOString()}\n`);

  try {
    // Connect to database
    await connectDB();

    // Run training
    const result = await trainAIKnowledge();

    console.log(`\n✅ Daily training completed successfully!`);
    console.log(`   Version: v${result.version}`);
    console.log(`   Stats: ${JSON.stringify(result.stats, null, 2)}`);
    
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Daily training failed:`, error.message);
    process.exit(1);
  }
};

run();

