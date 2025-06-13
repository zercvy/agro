// import { Router } from 'express';
// import { register, login, logout, getProfile } from '../../TRAAAASSSHHHHH/authController';
// import { authMiddleware } from '../middleware/authMiddleware';

// const router = Router();

// router.post('/register', register);
// router.post('/login', login);
// router.post('/logout', logout);
// router.get('/me', authMiddleware, getProfile);

// export default router;

import { Router } from 'express';
import { register } from '../../controllers/auth/registerController';
import { login } from '../../controllers/auth/loginController';
import { logout, getProfile } from '../../controllers/auth/commonAuthController';
import { authMiddleware } from '../../middleware/authMiddleware';
import { confirmEmail } from '../../controllers/auth/confirmEmail';
const router = Router();



router.get('/verify', confirmEmail);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authMiddleware, getProfile);

export default router;
