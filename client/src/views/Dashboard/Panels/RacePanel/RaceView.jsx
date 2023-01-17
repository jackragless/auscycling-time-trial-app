import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RaceService, BikeService, CourseService } from "../../../../services";
import { dataOriginal, dataAdjusted } from "./RaceData";

import {
    ViewContainer,
    PanelContainer,
    PanelSection,
} from "../../../../components/Layouts";
import TimeAnalysis from "./TimeAnalysis";
import { LineChart } from "../../../../components/StructuredData";
import {
    VStack,
    HStack,
    Box,
    Fade,
    Button,
    useToast,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    RadioGroup,
    Radio,
} from "@chakra-ui/react";
import { BsArrowLeft, BsChevronRight } from "react-icons/bs";

const RaceView = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [raceDetails, setRaceDetails] = useState(null);
    const [bikeDetails, setBikeDetails] = useState(null);
    const [courseDetails, setCourseDetails] = useState(null);
    const [curMousePos, setCurMousePos] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [adjustParameters, setAdjustParameters] = useState({
        crr: 0,
        power: 0,
        mass: 0,
        drag: 0,
    });
    // Original and adjusted datasets, this will be called from the server in future.
    const [data, setData] = useState({ dataOriginal, dataAdjusted });
    const [xSeriesMode, setxSeriesMode] = useState(false);

    const params = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    // Captures the average change in the data series over time.
    const simpleMovingAverage = (arr, window) => {
        if (!arr || arr.length < window) {
            return [];
        }
        let index = window - 1;
        const length = arr.length + 1;
        const simpleMovingAverages = [];
        while (++index < length) {
            const windowSlice = arr.slice(index - window, index);
            const sum = windowSlice.reduce((prev, curr) => prev + curr, 0);
            simpleMovingAverages.push(sum / window);
        }
        return simpleMovingAverages;
    };

    // Generate series data to send to LineChart component
    const createLineSeries = (mode, y_vars, data, smaWindow = 20) => {
        let x_var = ["dist", "distance (m)"];
        if (mode) {
            x_var = ["time", "time (s)"];
        }
        const seriesOutput = {};
        seriesOutput["ySeries"] = y_vars.map(subarr => {
            return {
                name: subarr[0],
                data: simpleMovingAverage(data[subarr[0]], smaWindow).map((dp, i) => {
                    return [data[x_var[0]][i], dp];
                }),
                type: subarr[2],
                unit: subarr[1],
            };
        });
        seriesOutput["xSeries"] = x_var[1];
        return seriesOutput;
    };

    // Fetching the race course data by its ID, as well as the associated
    // course and bike data objects.
    const fetchRaceById = useCallback(async () => {
        setIsLoading(true);
        try {
            const raceRes = await RaceService.getRaceById(params.raceId);
            const bikeRes = await BikeService.getBikeById(raceRes?.data?.race?.bike);
            const courseRes = await CourseService.getCourseById(
                raceRes?.data?.race?.course
            );
            await new Promise(res => setTimeout(res, 250));

            // Parsing the JSON string to retrieve the course data object.
            const newCourseData = courseRes;
            newCourseData.data.course.course_data = JSON.parse(
                courseRes?.data?.course?.course_data
            );

            setRaceDetails(raceRes?.data);
            setBikeDetails(bikeRes?.data);
            setCourseDetails(newCourseData);
        } catch (err) {
            toast({
                position: "bottom-left",
                description: err.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                containerStyle: {
                    pb: 6,
                    pl: 6,
                    m: 0,
                },
            });

            navigate("/dashboard");
        } finally {
            setIsLoading(false);
        }
    }, [params, navigate, toast]);

    useEffect(() => {
        fetchRaceById();
    }, [fetchRaceById]);

    return (
        <Fade in={!isLoading} unmountOnExit>
            <ViewContainer>
                <PanelContainer>
                    <HStack w="100%" spacing={6}>
                        <Button
                            leftIcon={<BsArrowLeft size="25px" />}
                            colorScheme="blue"
                            onClick={() => navigate("/dashboard")}
                        >
                            Back
                        </Button>
                        <Breadcrumb
                            spacing="8px"
                            separator={<BsChevronRight color="gray.500" />}
                        >
                            <BreadcrumbItem>
                                <BreadcrumbLink onClick={() => navigate("/dashboard")}>
                                    Dashboard
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <BreadcrumbLink>
                                    {raceDetails?.race?.raceName}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </Breadcrumb>
                    </HStack>
                    {/** Race Plan Data */}
                    <Tabs index={tabIndex} onChange={setTabIndex}>
                        {/** Race Power Plan Links */}
                        <TabList>
                            <Tab>Power Plan</Tab>
                            <Tab>Time Analysis</Tab>
                            <Tab>Weather</Tab>
                        </TabList>
                        {/** Race Power Plan Panels */}
                        <TabPanels pt={6}>
                            <TabPanel p={0}>
                                <PanelSection
                                    title={`${raceDetails?.race?.raceName} Power Plan`}
                                >
                                    <Box p={6}>
                                        <VStack w="100%">
                                            <RadioGroup
                                                value={(1 + xSeriesMode).toString()}
                                                onChange={() =>
                                                    setxSeriesMode(!xSeriesMode)
                                                }
                                            >
                                                <HStack w="100%" spacing={5}>
                                                    <Radio colorScheme="red" value="1">
                                                        Distance
                                                    </Radio>
                                                    <Radio colorScheme="green" value="2">
                                                        Time
                                                    </Radio>
                                                </HStack>
                                            </RadioGroup>
                                            <LineChart
                                                data={createLineSeries(
                                                    xSeriesMode,
                                                    [
                                                        ["elevation", "m", "area"],
                                                        ["power_net", "watts", "line"],
                                                        ["speed", "km/h", "line"],
                                                    ],
                                                    data["dataOriginal"],
                                                    20
                                                )}
                                                width={1200}
                                                height={600}
                                            />
                                        </VStack>
                                    </Box>
                                </PanelSection>
                            </TabPanel>
                            <TabPanel p={0}>
                                <PanelSection title="Time Analysis">
                                    <Box p={6}>
                                        <TimeAnalysis
                                            dataOriginal={dataOriginal}
                                            dataAdjusted={dataAdjusted}
                                            adjustParameters={adjustParameters}
                                            setAdjustParameters={setAdjustParameters}
                                        />
                                    </Box>
                                </PanelSection>
                            </TabPanel>
                            <TabPanel p={0}>
                                <PanelSection title="Weather">
                                    <Box p={6}>
                                        <VStack w="100%">
                                            <RadioGroup
                                                value={(1 + xSeriesMode).toString()}
                                                onChange={() =>
                                                    setxSeriesMode(!xSeriesMode)
                                                }
                                            >
                                                <HStack w="100%" spacing={5}>
                                                    <Radio colorScheme="red" value="1">
                                                        Distance
                                                    </Radio>
                                                    <Radio colorScheme="green" value="2">
                                                        Time
                                                    </Radio>
                                                </HStack>
                                            </RadioGroup>
                                            <LineChart
                                                data={createLineSeries(
                                                    xSeriesMode,
                                                    [
                                                        ["humidity", "gm3", "line"],
                                                        ["air_pressure", "hPa", "line"],
                                                        [
                                                            "relative_wind_speed",
                                                            "km/h",
                                                            "line",
                                                        ],
                                                    ],
                                                    data["dataOriginal"],
                                                    100
                                                )}
                                                width={1200}
                                                height={600}
                                            />
                                        </VStack>
                                    </Box>
                                </PanelSection>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </PanelContainer>
            </ViewContainer>
        </Fade>
    );
};

export default RaceView;
