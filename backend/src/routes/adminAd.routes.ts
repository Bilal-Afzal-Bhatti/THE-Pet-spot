import express from 'express';
import {
  createAdminAd,
  updateAdminAd,
  deleteAdminAd,
  getUserAdminAds,
  getApprovedAdminAdsByCategory,
  getApprovedAdminAdById,
} from '../controllers/adminAd.controller.js';

import { authMiddleware as protect } from "../middlewares/authMiddleware.js";
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// User specific routes
router.post('/', protect, upload.array('images', 5), createAdminAd);
router.patch('/:id', protect, upload.array('images', 5), updateAdminAd);
router.delete('/:id', protect, deleteAdminAd);
router.get('/my-ads', protect, getUserAdminAds);

// Public approved ads routes
router.get('/approved/:category', getApprovedAdminAdsByCategory);
router.get('/approved/:category/:id', getApprovedAdminAdById);

export default router;