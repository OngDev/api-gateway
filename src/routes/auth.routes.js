// This file just can be tested by integration tests
/* istanbul ignore file */
import express from 'express';
import AuthController from '../controllers/auth.controller';
import Authorize from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', (req, res) => AuthController.register(req, res));
router.post('/login', (req, res) => AuthController.login(req, res));
router.get('/current', Authorize, (req, res) => AuthController.getCurrent(req, res));
router.post('/logout', Authorize, (req, res) => AuthController.logout(req, res));
router.post('/logoutAll', Authorize, (req, res) => AuthController.logoutAll(req, res));

export default router;
