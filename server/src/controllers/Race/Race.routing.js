// NODE OR NPM RELATED IMPORTS
const express = require("express");

// LOCAL IMPORTS
const { checkIfAuthenticated } = require("../../middlewares/Auth/Auth.middleware");
const addRace = require("./addRace.action");
const getRacesForUser = require("./getRacesForUser.action");
const getRaceById = require("./getRaceById.action");
const deleteRace = require("./deleteRace.action");

const router = express.Router();

router.get("/races/:id", checkIfAuthenticated, getRacesForUser);
router.get("/race/:id", checkIfAuthenticated, getRaceById);
router.post("/race", checkIfAuthenticated, addRace);
router.delete("/race/:id", checkIfAuthenticated, deleteRace);

module.exports = router;
