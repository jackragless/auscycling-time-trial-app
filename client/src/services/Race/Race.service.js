import { Axios } from "../Axios.service";
import { AuthService } from "../Auth/Auth.service";

const addRace = async (
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
    windSpeed
) => {
    const token = await AuthService.fetchUserToken();
    const body = {
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
    };

    const res = await Axios.post("/race", body, {
        headers: { authorization: `Bearer ${token}` },
    });

    return res.data;
};

const getRacesForUser = async userId => {
    const token = await AuthService.fetchUserToken();

    const res = await Axios.get(`/races/${userId}`, {
        headers: { authorization: `Bearer ${token}` },
    });

    return res.data;
};

const getRaceById = async raceId => {
    const token = await AuthService.fetchUserToken();

    const res = await Axios.get(`/race/${raceId}`, {
        headers: { authorization: `Bearer ${token}` },
    });

    return res.data;
};

const deleteRace = async raceId => {
    const token = await AuthService.fetchUserToken();

    const res = await Axios.delete(`/race/${raceId}`, {
        headers: { authorization: `Bearer ${token}` },
    });

    return res.data;
};

export const RaceService = {
    addRace,
    getRacesForUser,
    getRaceById,
    deleteRace,
};
