const admin = require("../../services/Admin.service");

/**
 * DELETE /course/:id - Deletes a course from the DB.
 *
 * @returns
 */
const deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        await admin.firestore().collection("Course").doc(id).delete();

        res.status(200).send(`Successfully Removed Course.`);
    } catch (err) {
        console.log(err);
        res.status(400).send("Bad Request.");
    }
};

module.exports = deleteCourse;
