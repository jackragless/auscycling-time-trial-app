import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BikeService } from "../../../../services";

import {
    ViewContainer,
    PanelContainer,
    PanelSection,
} from "../../../../components/Layouts";
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
} from "@chakra-ui/react";
import { BsArrowLeft, BsChevronRight } from "react-icons/bs";

const BikeProperty = ({ label, value }) => {
    return (
        <HStack w="100%" spacing={4}>
            <Box
                w="20%"
                p={2}
                px={4}
                rounded="md"
                border="1px"
                borderColor="gray.100"
                bg="gray.100"
            >
                {label}
            </Box>
            <Box w="80%" p={2} px={4} rounded="md" border="1px" borderColor="gray.300">
                {value}
            </Box>
        </HStack>
    );
};

const BikeView = () => {
    const [bikeDetails, setBikeDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const params = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const fetchBikeById = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await BikeService.getBikeById(params.bikeId);
            await new Promise(res => setTimeout(res, 250));

            setBikeDetails(res.data);
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
        fetchBikeById();
    }, [fetchBikeById]);

    return (
        <Fade in={!isLoading} unmountOnExit>
            <ViewContainer>
                <PanelContainer>
                    <HStack w="100" spacing={6}>
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
                                    {bikeDetails?.bike?.bikeName}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </Breadcrumb>
                    </HStack>
                    {/** Bike Data */}
                    <PanelSection title="Bike Data">
                        <Box p={6}>
                            <VStack w="100%" spacing={4} alignItems="flex-start">
                                <BikeProperty
                                    label="Bike Name"
                                    value={bikeDetails?.bike?.bikeName}
                                />
                                <BikeProperty
                                    label="Type"
                                    value={bikeDetails?.bike?.bikeType}
                                />
                                <BikeProperty
                                    label="Weight"
                                    value={bikeDetails?.bike?.bikeWeight}
                                />
                                <BikeProperty
                                    label="Components"
                                    value={`${bikeDetails?.bike?.bikeComponent} End`}
                                />
                            </VStack>
                        </Box>
                    </PanelSection>
                    {/** Wheel & Tire Data */}
                    <PanelSection title="Wheel & Tire Data">
                        <Box p={6}>
                            <VStack w="100%" spacing={4} alignItems="flex-start">
                                <BikeProperty
                                    label="Front Wheel Type"
                                    value={bikeDetails?.bike?.frontWheelType}
                                />
                                <BikeProperty
                                    label="Front Wheel Width"
                                    value={bikeDetails?.bike?.frontWheelWidthType}
                                />
                                <BikeProperty
                                    label="Rear Wheel Type"
                                    value={bikeDetails?.bike?.rearWheelType}
                                />
                                <BikeProperty
                                    label="Rear Wheel Width"
                                    value={bikeDetails?.bike?.rearWheelWidthType}
                                />
                            </VStack>
                        </Box>
                    </PanelSection>
                    {/** Riding Style */}
                    <PanelSection title="Riding Style">
                        <Box p={6}>
                            <VStack w="100%" spacing={4} alignItems="flex-start">
                                <BikeProperty
                                    label="Racing Position"
                                    value={bikeDetails?.bike?.racingPosition}
                                />
                                <BikeProperty
                                    label="Climbing Position"
                                    value={bikeDetails?.bike?.climbingPosition}
                                />
                                <BikeProperty
                                    label="Helmet Type"
                                    value={bikeDetails?.bike?.helmetType}
                                />
                            </VStack>
                        </Box>
                    </PanelSection>
                    {/** Calculated Values */}
                    <PanelSection title="Calculated Values">
                        <Box p={6}>
                            <VStack w="100%" spacing={4} alignItems="flex-start">
                                <BikeProperty
                                    label="Rolling Resistance"
                                    value={bikeDetails?.bike?.rollingResistance}
                                />
                                <BikeProperty
                                    label="Mechanical Loss"
                                    value={bikeDetails?.bike?.mechanicalLoss}
                                />
                            </VStack>
                        </Box>
                    </PanelSection>
                </PanelContainer>
            </ViewContainer>
        </Fade>
    );
};

export default BikeView;
