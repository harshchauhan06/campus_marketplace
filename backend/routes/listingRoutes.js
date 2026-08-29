const express = require('express');
const router = express.Router();
const { 
  createListing, 
  getListings, 
  getListingById, 
  updateListing, 
  deleteListing 
} = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getListings);
router.get('/:id', getListingById);

// Protected routes (require token)
router.post('/', protect, createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);

module.exports = router;
