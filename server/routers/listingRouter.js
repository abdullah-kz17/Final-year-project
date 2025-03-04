const express = require("express");
const {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
} = require("../controllers/listingController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", verifyToken, createListing);
router.get("/", getListings);
router.get("/:id", getListingById);
router.put("/:id", verifyToken, updateListing);
router.delete("/:id", verifyToken, deleteListing);

module.exports = router;
