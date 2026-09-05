const pool = require('../config/db');

// @route   POST /api/favorites/:listing_id
// @desc    Toggle a listing in favorites (Add/Remove)
// @access  Private
const toggleFavorite = async (req, res) => {
  try {
    const { listing_id } = req.params;
    const user_id = req.user.id;

    // Check if it already exists
    const checkFav = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND listing_id = $2',
      [user_id, listing_id]
    );

    if (checkFav.rows.length > 0) {
      // It exists, so we remove it
      await pool.query('DELETE FROM favorites WHERE user_id = $1 AND listing_id = $2', [user_id, listing_id]);
      return res.json({ message: 'Removed from favorites', isFavorite: false });
    } else {
      // It doesn't exist, so we add it
      await pool.query('INSERT INTO favorites (user_id, listing_id) VALUES ($1, $2)', [user_id, listing_id]);
      return res.json({ message: 'Added to favorites', isFavorite: true });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   GET /api/favorites
// @desc    Get all favorite listings for a user
// @access  Private
const getFavorites = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    // Join favorites with listings to get the actual listing details
    const favorites = await pool.query(
      `SELECT listings.*, users.name as seller_name, users.is_verified 
       FROM favorites 
       JOIN listings ON favorites.listing_id = listings.id 
       JOIN users ON listings.seller_id = users.id 
       WHERE favorites.user_id = $1
       ORDER BY favorites.created_at DESC`,
      [user_id]
    );

    res.json(favorites.rows);
  } catch (error) {
    console.error('Error fetching favorites:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   GET /api/favorites/check/:listing_id
// @desc    Check if a specific listing is favorited by the user
// @access  Private
const checkIsFavorite = async (req, res) => {
  try {
    const { listing_id } = req.params;
    const user_id = req.user.id;

    const checkFav = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND listing_id = $2',
      [user_id, listing_id]
    );

    res.json({ isFavorite: checkFav.rows.length > 0 });
  } catch (error) {
    console.error('Error checking favorite:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  toggleFavorite,
  getFavorites,
  checkIsFavorite
};
