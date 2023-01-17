const admin = require("../../services/Admin.service");
const { PythonShell } = require("python-shell");

/**
 * POST /race - Creates a new race.
 *
 * @returns
 */
const addRace = async (req, res) => {
    const {
        userId,
        bike,
        bikeName,
        course,
        courseName,
        distance,
        humidity,
        raceName,
        raceType,
        roadCondition,
        temperature,
        terrain,
        windDirection,
        windSpeed,
    } = req.body;

    try {
        // The document creation time.
        const created_at = Math.floor(Date.now() / 1000);

        // Associated User and Bike Data.
        const userData = await admin
            .firestore()
            .collection("UserProfiles")
            .doc(userId)
            .get();
        const bikeData = await admin.firestore().collection("Bike").doc(bike).get();
        const courseData = await admin.firestore().collection("Course").doc(course).get();

        // Creating the BikeRider data object.
        const newBikeRiderRef = await admin.firestore().collection("BikeRider").doc();
        await newBikeRiderRef.set({
            user_id: userId,
            created_at,
            rider: {
                rider_mass_kg: userData?.data().weight,
                other_mass_kg: 1,
                functional_threshold_power_w: userData?.data().functional_threshold_power,
                anaerobic_work_capacity_j: 35000,
                anaerobic_recovery_function: 1,
            },
            bike: {
                bike_mass_kg: bikeData?.data().bikeWeight,
                rolling_resistance_coefficient: bikeData?.data().rollingResistance,
                mechanical_efficiency: bikeData?.data().mechanicalLoss,
                moment_of_intertia_front: 0.08,
                moment_of_intertia_rear: 0.08,
                wheel_radius: 0.335,
            },
            cda: {
                a: { 12: 0.188, 14: 0.184, 16: 0.182 },
            },
            pct_slope_thresholds: {
                power: { steady_state: -1, over_state: 7.5 },
                position: { seated: -1, outriggers: 3 },
            },
            functional_power_by_state: {
                descent_state: 0.02,
                steady_state: 0.91,
                over_state: 1.1,
            },
        });
        const bikeRider = await newBikeRiderRef.get();

        // Creating the RacePowerPlan data object.
        const newRaceRef = await admin.firestore().collection("Race").doc();
        await newRaceRef.set({
            user_id: userId,
            created_at,
            bikeRider: newBikeRiderRef.id,
            bike,
            bikeName,
            course,
            courseName,
            distance,
            humidity,
            raceName,
            raceType,
            roadCondition,
            temperature,
            terrain,
            windDirection,
            windSpeed,
        });
        const race = await newRaceRef.get();

        // Returning the RacePowerPlan data to the client.
        res.status(200).send({
            data: { id: newRaceRef.id, race: race.data() },
            message: "Successfully Added Race.",
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Bad Request.");
    }
};

module.exports = addRace;
