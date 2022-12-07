import express from 'express';
import bcrypt from 'bcrypt';
import { validateReqBody, firstToUpperCase } from '../lib/helpers.js';
import Users from '../db/models/Users.js';
const router = express.Router();

router.post('/signup', async (req, res) => {
  if (
    !validateReqBody({
      body: req.body,
      expectedPropertys: [
        'firstName',
        'lastName',
        'phone',
        'email',
        'password',
        'allowDataShare',
      ],
    })
  )
    res.json({ result: false, error: 'Invalid user data' });
  else {
    const { firstName, lastName, phone, email, password, allowDataShare } = req.body;

    if (await Users.findOne({ email })) {
      return res.json({ result: false, error: 'User already exists' });
    }

    await new Users({
      firstName: firstToUpperCase(firstName),
      lastName: firstToUpperCase(lastName),
      phone,
      email,
      password: await bcrypt.hash(password, 10),
      allowDataShare,
    }).save();

    res.json({ result: true });
  }
});

router.post('/login', async (req, res) => {
  if (
    !validateReqBody({
      body: req.body,
      expectedPropertys: ['email', 'password'],
    })
  )
    res.json({ result: false, error: 'Invalid login data' });
  else {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.json({ result: false, error: 'Email or password incorrect' });
      return;
    }

    if (user.userItems.length > 0) await user.populate('userItems');

    res.json({
      result: true,
      user: {
        token: user.token,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        items: user.userItems,
      },
    });
  }
});

export default router;
