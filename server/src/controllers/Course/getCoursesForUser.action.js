const admin = require("../../services/Admin.service");

/**
 * GET /course/:id - Returns a list of courses associated with a user.
 *
 * @returns
 */
const getCoursesForUser = async (req, res) => {
    const { id } = req.params;

    try {
        const snapshot = await admin
            .firestore()
            .collection("Course")
            .where("user_id", "==", id)
            .get();

        let courses = {};
        snapshot.docs.map(doc => (courses[doc.id] = doc.data()));

        res.status(200).send(courses);
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
};

module.exports = getCoursesForUser;
