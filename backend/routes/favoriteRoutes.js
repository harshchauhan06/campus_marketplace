const express = require('express');
const router = express.Router();
const { toggleFavorite, getFavorites, checkIsFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

// All favorite routes are protected (must be logged in)
router.get('/', protect, getFavorites);
router.post('/:listing_id', protect, toggleFavorite);
router.get('/check/:listing_id', protect, checkIsFavorite);

module.exports = router;
