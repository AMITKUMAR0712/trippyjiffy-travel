// routes/chatbot.routes.js (Using import/export)

import express from 'express';
// Controller फ़ंक्शन को de-structure करके import करें
import { handleChatQuery } from '../controller/chatbotcontroller.js'; 

const router = express.Router();

// POST request for handling chat queries
router.post('/query', handleChatQuery);

export default router; // router को export default करें