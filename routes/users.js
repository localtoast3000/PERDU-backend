import express from 'express';
import bcrypt from 'bcrypt';
import uid2 from 'uid2';
import { validateReqBody } from '../lib/helpers.js';
import Users from '../db/models/Users.js';
const router = express.Router();

router.post('/signup', async (req, res) => {});

export default router;
