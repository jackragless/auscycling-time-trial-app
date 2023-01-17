// NODE OR NPM RELATED IMPORTS
const express = require("express");

// LOCAL IMPORTS
const { checkIfAuthenticated } = require("../../middlewares/Auth/Auth.middleware");
const getCourses = require("./getCourses.action");
const getCoursesForUser = require("./getCoursesForUser.action");
const getCourseById = require("./getCourseById.action");
const addCourse = require("./addCourse.action");
const uploadCourse = require("./uploadCourse.action");
const deleteCourse = require("./deleteCourse.action");
const getTerrainTypes = require("./getTerrainTypes.action");

const router = express.Router();

router.get("/courses/:id", checkIfAuthenticated, getCoursesForUser);
router.get("/course/terrain", checkIfAuthenticated, getTerrainTypes);
router.get("/course/:id", checkIfAuthenticated, getCourseById);
router.get("/courses", checkIfAuthenticated, getCourses);
router.post("/course", checkIfAuthenticated, addCourse);
router.post("/uploadCourse", checkIfAuthenticated, uploadCourse);
router.delete("/course/:id", checkIfAuthenticated, deleteCourse);

module.exports = router;
