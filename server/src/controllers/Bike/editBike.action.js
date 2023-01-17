const admin = require("../../services/Admin.service");

/**
 * POST /bike/:bikeId - Edit bike details using the users submitted form data.
 *
 * @returns
 */
const editBike = async (req, res) => {
    const { id } = req.params;
    const {
        bikeName,
        bikeType,
        bikeWeight,
        bikeComponent,
        frontWheelType,
        frontWheelWidthType,
        rearWheelType,
        rearWheelWidthType,
        tireType,
        tubeType,
        racingPosition,
        climbingPosition,
        helmetType,
        rollingResistance,
        mechanicalLoss,
    } = req.body;

    try {
        await admin
            .firestore()
            .collection("Bike")
            .doc(id)
            .update({
                bikeName,
                bikeType,
                bikeWeight: parseFloat(bikeWeight),
                bikeComponent,
                frontWheelType,
                frontWheelWidthType,
                rearWheelType,
                rearWheelWidthType,
                tireType,
                tubeType,
                racingPosition,
                climbingPosition,
                helmetType,
                rollingResistance: parseFloat(rollingResistance),
                mechanicalLoss: parseFloat(mechanicalLoss),
            });
        const bike = await admin.firestore().collection("Bike").doc(id).get();

        res.status(200).send({
            data: { id: id, bike: bike.data() },
            message: "Successfully Edited Bike.",
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Bad Request.");
    }
};

module.exports = editBike;
