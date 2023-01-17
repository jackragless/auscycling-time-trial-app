const admin = require("../../services/Admin.service");

/**
 * GET /race/:id - Returns a list of races associated with a user.
 *
 * @returns
 */
const getRacesForUser = async (req, res) => {
    const { id } = req.params;

    try {
        const snapshot = await admin
            .firestore()
            .collection("Race")
            .where("user_id", "==", id)
            .get();

        let races = {};
        snapshot.docs.map(doc => (races[doc.id] = doc.data()));

        res.status(200).send(races);
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
};

module.exports = getRacesForUser;
