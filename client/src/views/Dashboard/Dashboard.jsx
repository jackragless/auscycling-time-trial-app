import React, { useState, useEffect } from "react";
import { CourseService, BikeService, RaceService } from "../../services";
import { auth } from "../../services/Firebase/Firebase.service";
import {
    DashboardPanel,
    ProfilePanel,
    CoursePanel,
    RacePanel,
    BikePanel,
} from "./Panels";
import { ViewContainer } from "../../components/Layouts";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";

const Dashboard = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [bikes, setBikes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [races, setRaces] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetches the list of courses associated with a user for display.
    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const res = await CourseService.getCoursesForUser(auth?.currentUser.uid);
            await new Promise(res => setTimeout(res, 500));

            setCourses(res);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetches the list of bikes associated with a user for display.
    const fetchBikes = async () => {
        setIsLoading(true);
        try {
            const res = await BikeService.getBikesForUser(auth?.currentUser.uid);
            await new Promise(res => setTimeout(res, 500));

            setBikes(res);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRaces = async () => {
        setIsLoading(true);
        try {
            const res = await RaceService.getRacesForUser(auth?.currentUser.uid);
            await new Promise(res => setTimeout(res, 500));

            setRaces(res);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBikes();
        fetchRaces();
        fetchCourses();
    }, []);

    return (
        <ViewContainer>
            <Tabs index={tabIndex} onChange={setTabIndex}>
                {/** Dashboard Panels Links */}
                <TabList>
                    <Tab>Dashboard</Tab>
                    <Tab>Profile</Tab>
                    <Tab>Bikes</Tab>
                    <Tab>Courses</Tab>
                    <Tab>Races</Tab>
                </TabList>
                {/** Dashboard Panels */}
                <TabPanels pt={6}>
                    <TabPanel p={0}>
                        <DashboardPanel
                            numBikes={Object.keys(bikes).length}
                            numCourses={Object.keys(courses).length}
                            numRaces={Object.keys(races).length}
                            races={races}
                            setTabIndex={setTabIndex}
                            isLoading={isLoading}
                        />
                    </TabPanel>
                    <TabPanel p={0}>
                        <ProfilePanel />
                    </TabPanel>
                    <TabPanel p={0}>
                        <BikePanel bikes={bikes} setBikes={setBikes} />
                    </TabPanel>
                    <TabPanel p={0}>
                        <CoursePanel courses={courses} setCourses={setCourses} />
                    </TabPanel>
                    <TabPanel p={0}>
                        <RacePanel
                            races={races}
                            setRaces={setRaces}
                            bikes={bikes}
                            courses={courses}
                        />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </ViewContainer>
    );
};
export default Dashboard;
