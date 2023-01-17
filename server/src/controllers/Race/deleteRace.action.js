const admin = require("../../services/Admin.service");

/**
 * DELETE /race/:id - Deletes a race from the DB.
 *
 * @returns
 */
const deleteRace = async (req, res) => {
    const { id } = req.params;

    try {
        const raceRef = await admin.firestore().collection("Race").doc(id);
        const bikeRiderId = await (await raceRef.get()).data().bikeRider;
        const bikeRiderRef = await admin
            .firestore()
            .collection("BikeRider")
            .doc(bikeRiderId);

        // Deletes both the Race, and the associated BikeRider.
        raceRef.delete();
        bikeRiderRef.delete();

        res.status(200).send(`Successfully Removed Race.`);
    } catch (err) {
        console.log(err);
        res.status(400).send("Bad Request.");
    }
};

module.exports = deleteRace;
