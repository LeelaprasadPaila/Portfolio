/**
 * AI Controller
 * Handles training, status, and querying of the AI knowledge base.
 */

import { trainAIKnowledge, getAIKnowledgeStatus, queryKnowledge } from '../services/aiTrainer.js';

/**
 * POST /api/ai/train
 * Triggers immediate training of the AI knowledge base (admin only)
 */
export const trainAI = async (req, res) => {
  try {
    // Start training asynchronously but respond with initial status
    res.status(202).json({
      message: 'AI knowledge training started',
      status: 'training',
      timestamp: new Date().toISOString(),
    });

    // Train in background
    trainAIKnowledge()
      .then((result) => {
        console.log(`✅ AI training completed: v${result.version}`);
      })
      .catch((err) => {
        console.error('❌ AI training failed:', err.message);
      });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

/**
 * POST /api/ai/train/sync
 * Triggers immediate training and waits for completion (admin only)
 */
export const trainAISync = async (req, res) => {
  try {
    const result = await trainAIKnowledge();
    res.json({
      message: 'AI knowledge base trained successfully',
      status: 'ready',
      version: result.version,
      stats: result.stats,
      lastTrainedAt: result.lastTrainedAt,
      trainingDuration: result.metadata.trainingDuration,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

/**
 * GET /api/ai/status
 * Returns current training status and stats
 */
export const getStatus = async (req, res) => {
  try {
    const status = await getAIKnowledgeStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

/**
 * GET /api/ai/knowledge
 * Returns the full knowledge base for client-side initialization
 */
export const getKnowledge = async (req, res) => {
  try {
    const status = await getAIKnowledgeStatus();

    if (!status.trained) {
      return res.status(404).json({
        message: 'Knowledge base not yet trained',
        trained: false,
        data: null,
      });
    }

    // We need the full data but strip the searchCorpus to reduce payload size
    const { default: AIKnowledge } = await import('../models/AIKnowledge.js');
    const knowledge = await AIKnowledge.findOne().sort({ version: -1 })
      .select('-knowledgeGraph.derived.searchCorpus');

    if (!knowledge) {
      return res.status(404).json({ message: 'No knowledge found' });
    }

    res.json({
      trained: true,
      version: knowledge.version,
      lastTrainedAt: knowledge.lastTrainedAt,
      stats: knowledge.stats,
      knowledgeGraph: knowledge.knowledgeGraph,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

/**
 * POST /api/ai/query
 * Query the AI knowledge base
 */
export const queryAI = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ message: 'Question is required', error: true });
    }

    const result = await queryKnowledge(question.trim());

    if (!result.trained) {
      return res.status(503).json({
        message: 'AI knowledge base not ready. Please ask the admin to sync data first.',
        trained: false,
        response: null,
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export default {
  trainAI,
  trainAISync,
  getStatus,
  getKnowledge,
  queryAI,
};

