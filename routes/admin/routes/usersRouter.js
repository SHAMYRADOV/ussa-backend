const express = require("express");
const {
  getAllUsers,
  searchUsers,
} = require("../../../controllers/admin/usersController");

const router = express.Router();

router.get("/", getAllUsers);
router.get("/search", searchUsers);

module.exports = router;
