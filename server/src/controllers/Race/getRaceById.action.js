const admin = require("../../services/Admin.service");

/**
 * GET /race/:id - Fetches a race by its id and returns the data.
 *
 * @returns
 */
const getRaceById = async (req, res) => {
    const { id } = req.params;

    try {
        const race = await admin.firestore().collection("Race").doc(id).get();

        if (!race.data()) {
            throw new Error("Unable to Find Race.");
        }

        res.status(200).send({
            data: { id: race.id, race: race.data() },
        });
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
};

module.exports = getRaceById;
