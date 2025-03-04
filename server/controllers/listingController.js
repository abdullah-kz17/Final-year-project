const Listing = require("../models/listingsModel");

// Create a new listing
exports.createListing = async (req, res) => {
  try {
    const listing = new Listing({ ...req.body, seller: req.user._id });
    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: "Error creating listing", error });
  }
};

// Get all listings with sorting, filtering, and pagination
exports.getListings = async (req, res) => {
  try {
    const {
      location,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      sort,
      page = 1,
      limit = 10,
    } = req.query;
    const filter = {};

    if (location)
      filter["location.coordinates"] = { $near: JSON.parse(location) };
    if (minPrice) filter.price = { ...filter.price, $gte: minPrice };
    if (maxPrice) filter.price = { ...filter.price, $lte: maxPrice };
    if (bedrooms) filter.bedrooms = bedrooms;
    if (bathrooms) filter.bathrooms = bathrooms;

    const sortOptions = sort ? { [sort]: -1 } : { createdAt: -1 };

    const listings = await Listing.find(filter)
      .populate("seller", "name email phone")
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching listings", error });
  }
};

// Get a specific listing by ID
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "seller",
      "name email phone"
    );
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: "Error fetching listing", error });
  }
};

// Update a listing
exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.seller.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this listing" });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: "Error updating listing", error });
  }
};

// Delete a listing
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.seller.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this listing" });
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting listing", error });
  }
};
