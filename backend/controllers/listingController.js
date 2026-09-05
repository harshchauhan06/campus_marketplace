const pool = require('../config/db');

// @route   POST /api/listings
// @desc    Create a new listing
// @access  Private
const createListing = async (req, res) => {
  try {
    const { title, description, price, category, condition, type, location } = req.body;
    const seller_id = req.user.id; // From the protect middleware

    const newListing = await pool.query(
      `INSERT INTO listings (seller_id, title, description, price, category, condition, type, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [seller_id, title, description, price, category, condition, type, location]
    );

    res.status(201).json({
      message: 'Listing created successfully',
      listing: newListing.rows[0],
    });
  } catch (error) {
    console.error('Error creating listing:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   GET /api/listings
// @desc    Get all active listings (with optional search, filters, and sort)
// @access  Public
const getListings = async (req, res) => {
  try {
    const { search, category, type, sort } = req.query;
    
    let queryStr = `
      SELECT listings.*, users.name as seller_name, users.is_verified 
      FROM listings 
      JOIN users ON listings.seller_id = users.id 
      WHERE listings.status = 'ACTIVE'
    `;
    const queryParams = [];

    // Add search condition if provided
    if (search) {
      queryParams.push(`%${search}%`);
      queryStr += ` AND (listings.title ILIKE $${queryParams.length} OR listings.description ILIKE $${queryParams.length})`;
    }

    // Add category filter if provided
    if (category) {
      queryParams.push(category);
      queryStr += ` AND listings.category = $${queryParams.length}`;
    }

    // Add type filter if provided
    if (type) {
      queryParams.push(type);
      queryStr += ` AND listings.type = $${queryParams.length}`;
    }

    // Determine sorting
    if (sort === 'price_asc') {
      queryStr += ` ORDER BY listings.price ASC, listings.created_at DESC`;
    } else if (sort === 'price_desc') {
      queryStr += ` ORDER BY listings.price DESC, listings.created_at DESC`;
    } else {
      queryStr += ` ORDER BY listings.created_at DESC`; // Default 'newest'
    }

    const listings = await pool.query(queryStr, queryParams);

    res.json(listings.rows);
  } catch (error) {
    console.error('Error fetching listings:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   GET /api/listings/my-listings
// @desc    Get all listings for the logged in user
// @access  Private
const getMyListings = async (req, res) => {
  try {
    const listings = await pool.query(
      `SELECT * FROM listings WHERE seller_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(listings.rows);
  } catch (error) {
    console.error('Error fetching my listings:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   GET /api/listings/:id
// @desc    Get a single listing by ID
// @access  Public
const getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const listing = await pool.query(
      `SELECT listings.*, users.name as seller_name, users.department, users.is_verified 
       FROM listings 
       JOIN users ON listings.seller_id = users.id 
       WHERE listings.id = $1`,
      [id]
    );

    if (listing.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json(listing.rows[0]);
  } catch (error) {
    console.error('Error fetching listing:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   PUT /api/listings/:id
// @desc    Update a listing
// @access  Private
const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, condition, type, location, status } = req.body;

    // First check if the listing exists and belongs to the user
    const listing = await pool.query('SELECT * FROM listings WHERE id = $1', [id]);
    
    if (listing.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.rows[0].seller_id !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized to update this listing' });
    }

    // Update the listing
    const updatedListing = await pool.query(
      `UPDATE listings 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description), 
           price = COALESCE($3, price), 
           category = COALESCE($4, category), 
           condition = COALESCE($5, condition), 
           type = COALESCE($6, type), 
           location = COALESCE($7, location),
           status = COALESCE($8, status)
       WHERE id = $9 RETURNING *`,
      [title, description, price, category, condition, type, location, status, id]
    );

    res.json({
      message: 'Listing updated successfully',
      listing: updatedListing.rows[0]
    });
  } catch (error) {
    console.error('Error updating listing:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   DELETE /api/listings/:id
// @desc    Delete a listing
// @access  Private
const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    // First check if the listing exists and belongs to the user
    const listing = await pool.query('SELECT * FROM listings WHERE id = $1', [id]);
    
    if (listing.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.rows[0].seller_id !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized to delete this listing' });
    }

    await pool.query('DELETE FROM listings WHERE id = $1', [id]);

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createListing,
  getListings,
  getMyListings,
  getListingById,
  updateListing,
  deleteListing,
};
