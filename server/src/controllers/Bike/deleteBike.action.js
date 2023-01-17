const admin = require("../../services/Admin.service");

/**
 * DELETE /bike/:id - Deletes a bike from the DB.
 *
 * @returns
 */
const deleteBike = async (req, res) => {
    const { id } = req.params;

    try {
        await admin.firestore().collection("Bike").doc(id).delete();

        res.status(200).send(`Successfully Removed Bike.`);
    } catch (err) {
        console.log(err);
        res.status(400).send("Bad Request.");
    }
};

module.exports = deleteBike;
