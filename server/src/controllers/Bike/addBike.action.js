const admin = require("../../services/Admin.service");

/**
 * POST /bike - Creates a new bike.
 *
 * @returns
 */
const addBike = async (req, res) => {
    const {
        userId,
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
        const newBikeRef = await admin.firestore().collection("Bike").doc();
        await newBikeRef.set({
            user_id: userId,
            created_at: Math.floor(Date.now() / 1000),
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
        const bike = await newBikeRef.get();

        res.status(200).send({
            data: { id: newBikeRef.id, bike: bike.data() },
            message: "Successfully Added Bike.",
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Bad Request.");
    }
};

module.exports = addBike;
