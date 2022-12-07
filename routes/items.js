import express from 'express';
import { validateReqBody, isObject, firstToUpperCase } from '../lib/helpers.js';
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

    if (await Items.findOne({ category: firstToUpperCase(category), declared })) {
      res.json({
        result: false,
        error: 'An item of this category was declared with the same date',
      });
      return;
    }

    const item = new Items({
      category: firstToUpperCase(category),
      details: isObject(details) ? details : null,
      locationInfo: isObject(locationInfo) ? locationInfo : null,
      authentication: isObject(authentication) ? authentication : null,
      userId: user._id,
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
    });
  }
});

router.put('/updatestatus', async (req, res) => {
  if (
    !validateReqBody({
      body: req.body,
      expectedPropertys: ['token', 'id', 'isFound'],
    })
  )
    res.json({ result: false, error: 'Invalid token or data' });
  else {
    const { token, id, isFound } = req.body;
    const user = await Users.findOne({ token });

    if (!user) {
      res.json({ result: false, error: 'Invalid token' });
      return;
    }

    if (typeof isFound !== 'boolean') {
      res.json({ result: false, error: 'isFound must be of type boolean' });
      return;
    }

    const item = await Items.findById(id);

    if (!item) {
      res.json({
        result: false,
        error: 'Item not found',
      });
      return;
    }

    if (String(item.userId) !== String(user._id)) {
      res.json({ result: false, error: 'User unauthorized to edit item' });
      return;
    }

    try {
      item.isFound = isFound;
      item.save();
    } catch {
      res.json({ result: false, error: 'Failed to update items isFound field' });
      return;
    }

    res.json({
      result: true,
    });
  }
});

export default router;
