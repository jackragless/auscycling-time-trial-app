const admin = require("../../services/Admin.service");

/**
 * GET /course/:id - Fetches a course by its id and returns the data.
 *
 * @returns
 */
const getCourseById = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await admin.firestore().collection("Course").doc(id).get();

        if (!course.data()) {
            throw new Error("Unable to Find Course.");
        }

        res.status(200).send({
            data: { id: course.id, course: course.data() },
        });
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
};

module.exports = getCourseById;
