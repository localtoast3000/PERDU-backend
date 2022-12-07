import express from 'express';
import { validateReqBody, isObject } from '../lib/helpers.js';
import Items from '../db/models/Items.js';
import Users from '../db/models/Users.js';
const router = express.Router();

router.post('/', async (req, res) => {
  if (
    !validateReqBody({
      body: req.body,
      expectedPropertys: ['token'],
    })
  )
    res.json({ result: false, error: 'Invalid token' });
  else {
    const { token } = req.body;
    const user = await Users.findOne({ token });

    if (!user) {
      res.json({ result: false, error: 'Invalid token' });
      return;
    }

    if (user.userItems.length > 0) await user.populate('userItems');

    res.json({
      result: true,
      items: user.userItems,
    });
  }
});

router.post('/add', async (req, res) => {
  if (
    !validateReqBody({
      body: req.body,
      expectedPropertys: [
        'token',
        'category',
        'details',
        'locationInfo',
        'authentication',
        'isFound',
        'declared',
      ],
    })
  )
    res.json({ result: false, error: 'Invalid token or item data' });
  else {
    const { token, category, details, locationInfo, authentication, isFound, declared } =
      req.body;
    const user = await Users.findOne({ token });

    if (!user) {
      res.json({ result: false, error: 'Invalid token' });
      return;
    }

    if (await Items.findOne({ category, declared })) {
      res.json({
        result: false,
        error: 'An item of this category was declared with the same date',
      });
      return;
    }

    const item = new Items({
      category,
      details: isObject(details) ? details : null,
      locationInfo: isObject(locationInfo) ? locationInfo : null,
      authentication: isObject(authentication) ? authentication : null,
      isFound,
      declared,
    });

    try {
      await user.userItems.push(item._id);
      await item.save();
      await user.save();
    } catch {
      res.json({ result: false, error: 'Failed to add item to user' });
      return;
    }

    res.json({
      result: true,
      user: user,
    });
  }
});

export default router;
