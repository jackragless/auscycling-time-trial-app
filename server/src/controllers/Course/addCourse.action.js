const admin = require("../../services/Admin.service");

/**
 * POST /course - Creates a new course.
 *
 * @returns
 */
const addCourse = async (req, res) => {
    const {
        userId,
        courseName,
        courseVisibility,
        courseDistance,
        courseLocation,
        courseData,
    } = req.body;

    try {
        const newCourseRef = await admin.firestore().collection("Course").doc();
        await newCourseRef.set({
            user_id: userId,
            created_at: Math.floor(Date.now() / 1000),
            course_name: courseName,
            course_visibility: courseVisibility,
            course_distance: courseDistance,
            course_address: courseLocation,
            course_data: courseData,
        });
        const course = await newCourseRef.get();

        res.status(200).send({
            data: { id: newCourseRef.id, course: course.data() },
            message: "Successfully Added Course.",
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Bad Request.");
    }
};

module.exports = addCourse;
