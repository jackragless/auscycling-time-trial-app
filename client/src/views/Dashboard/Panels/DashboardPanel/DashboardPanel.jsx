import React, { Fragment } from "react";
import { auth } from "../../../../services/Firebase/Firebase.service";
import { useNavigate } from "react-router-dom";

import { PanelContainer, PanelSection } from "../../../../components/Layouts";
import { StatCard, Table } from "../../../../components/StructuredData";
import { HStack, Tr, Td, Spinner, IconButton, Box, Flex } from "@chakra-ui/react";
import { RiSearchLine } from "react-icons/ri";

const columns = ["Race", "Type", "Distance (km)", "Course", "Bike", ""];

const DashboardPanel = ({
    numBikes,
    numCourses,
    numRaces,
    races,
    setTabIndex,
    isLoading,
}) => {
    const navigate = useNavigate();
    const navigateRace = async raceId => {
        const username = auth?.currentUser.displayName.split(" ").join("").toLowerCase();

        navigate("/" + username + "/race/" + raceId);
    };

    return (
        <PanelContainer>
            <HStack w="100%" spacing={6}>
                <StatCard title="Bikes" onClick={() => setTabIndex(2)}>
                    {isLoading ? <Spinner /> : numBikes}
                </StatCard>
                <StatCard title="Courses" onClick={() => setTabIndex(3)}>
                    {isLoading ? <Spinner /> : numCourses}
                </StatCard>
                <StatCard title="Races" onClick={() => setTabIndex(4)}>
                    {isLoading ? <Spinner /> : numRaces}
                </StatCard>
            </HStack>
            <PanelSection title="Recent Race Plans">
                {isLoading ? (
                    <Box w="100%" bg="gray.100">
                        <Flex h="113px" alignItems="center" justifyContent="center">
                            <Spinner />
                        </Flex>
                    </Box>
                ) : (
                    <Table columns={columns}>
                        {Object?.keys(races)?.length > 0 ? (
                            <Fragment>
                                {Object?.keys(races)?.map(raceId => (
                                    <Tr key={raceId}>
                                        <Td>{races[raceId].raceName}</Td>
                                        <Td>{races[raceId].raceType}</Td>
                                        <Td>{races[raceId].distance?.toFixed(2)}</Td>
                                        <Td>{races[raceId].courseName} End</Td>
                                        <Td>{races[raceId].bikeName}</Td>
                                        <Td>
                                            <HStack
                                                w="100%"
                                                spacing={4}
                                                justifyContent="flex-end"
                                            >
                                                <IconButton
                                                    id={`view-${raceId}`}
                                                    colorScheme="blue"
                                                    variant="outline"
                                                    icon={<RiSearchLine size="20px" />}
                                                    onClick={() => navigateRace(raceId)}
                                                />
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))}
                            </Fragment>
                        ) : (
                            <Tr>
                                <Td colSpan={7}>No races available.</Td>
                            </Tr>
                        )}
                    </Table>
                )}
            </PanelSection>
        </PanelContainer>
    );
};

export default DashboardPanel;
