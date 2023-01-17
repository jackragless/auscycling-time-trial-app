import { Axios } from "../Axios.service";
import { AuthService } from "../Auth/Auth.service";

const getCourses = async () => {
    const token = await AuthService.fetchUserToken();

    const res = await Axios.get("/courses", {
        headers: { authorization: `Bearer ${token}` },
    });

    return res.data;
};

const getCoursesForUser = async userId => {
    const token = await AuthService.fetchUserToken();

    const res = await Axios.get(`/courses/${userId}`, {
        headers: { authorization: `Bearer ${token}` },
    });

    return res.data;
};

const getCourseById = async courseId => {
    const token = await AuthService.fetchUserToken();

    const res = await Axios.get(`/course/${courseId}`, {
        headers: { authorization: `Bearer ${token}` },
    });

    return res.data;
};

const addCourse = async (
    userId,
    courseName,
    courseVisibility,
    courseDistance,
    courseLocation,
    courseData
) => {
    const token = await AuthService.fetchUserToken();

    const res = await Axios.post(
        "/course",
        {
            userId,
            courseName,
            courseVisibility,
            courseDistance,
            courseLocation,
            courseData,
        },
        {
            headers: { authorization: `Bearer ${token}` },
        }
    );

    return res.data;
};

const deleteCourse = async courseId => {
    const token = await AuthService.fetchUserToken();

    const res = await Axios.delete(`/course/${courseId}`, {
        headers: { authorization: `Bearer ${token}` },
    });

    return res.data;
};

const uploadCourse = async formData => {
    const token = await AuthService.fetchUserToken();

    const res = await Axios.post("/uploadCourse", formData, {
        headers: { authorization: `Bearer ${token}` },
    });

    return res;
};

const getTerrainTypes = async () => {
    const token = await AuthService.fetchUserToken();

    const res = await Axios.get("/course/terrain", {
        headers: { authorization: `Bearer ${token}` },
    });

    return res.data;
};

export const CourseService = {
    getCourses,
    getCoursesForUser,
    getCourseById,
    uploadCourse,
    addCourse,
    deleteCourse,
    getTerrainTypes,
};
