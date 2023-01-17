import React, { Fragment, useState } from "react";
import { auth } from "../../../../services/Firebase/Firebase.service";
import { useNavigate } from "react-router-dom";

import AddRaceForm from "./AddRaceForm";
import { Table } from "../../../../components/StructuredData";
import { PanelContainer, PanelSection } from "../../../../components/Layouts";
import {
    HStack,
    IconButton,
    Box,
    Button,
    useToast,
    Tr,
    Td,
    Spinner,
} from "@chakra-ui/react";
import { RiSearchLine, RiDeleteBinLine } from "react-icons/ri";
import { RaceService } from "../../../../services";

const columns = ["Race", "Type", "Distance (km)", "Course", "Bike", ""];

const RacePanel = ({ races, setRaces, bikes, courses }) => {
    const [modalStates, setModalStates] = useState({ addModal: false });

    const toast = useToast();

    // Handles the modal render states.
    const handleSetModalState = (modalName, state) => {
        setModalStates(curStates => ({ ...curStates, [modalName]: state }));
    };

    // Delete a race by its ID.
    const handleDeleteRace = async (e, raceId) => {
        const { id } = e.currentTarget;

        handleSetModalState(id, true);
        try {
            const res = await RaceService.deleteRace(raceId);
            await new Promise(res => setTimeout(res, 250));

            toast({
                position: "bottom-left",
                description: res,
                status: "success",
                duration: 5000,
                isClosable: true,
                containerStyle: {
                    pb: 6,
                    pl: 6,
                    m: 0,
                },
            });

            // Instead of re-retrieving everything, just remove the bike in state.
            setRaces(curRaces => {
                delete curRaces[raceId];
                return { ...curRaces };
            });
        } catch (err) {
            console.log(err);
        } finally {
            handleSetModalState(id, false);
        }
    };

    const navigate = useNavigate();
    const navigateRace = async raceId => {
        const username = auth?.currentUser.displayName.split(" ").join("").toLowerCase();

        navigate("/" + username + "/race/" + raceId);
    };

    return (
        <PanelContainer>
            <PanelSection title="Race Form">
                <Box px={6} py={8}>
                    <Button
                        colorScheme="blue"
                        onClick={() => handleSetModalState("addModal", true)}
                    >
                        Add Race
                    </Button>
                </Box>
            </PanelSection>
            {/** Table of bike data. */}
            <PanelSection title="Race Plans">
                <Table columns={columns}>
                    {Object?.keys(races)?.length > 0 ? (
                        <Fragment>
                            {Object?.keys(races)?.map(raceId => (
                                <Tr key={raceId}>
                                    <Td>{races[raceId].raceName}</Td>
                                    <Td>{races[raceId].raceType}</Td>
                                    <Td>{races[raceId].distance.toFixed(2)}</Td>
                                    <Td>{races[raceId].courseName}</Td>
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
                                            <IconButton
                                                id={`delete-${raceId}`}
                                                colorScheme="red"
                                                icon={
                                                    modalStates[`delete-${raceId}`] ? (
                                                        <Spinner />
                                                    ) : (
                                                        <RiDeleteBinLine size="20px" />
                                                    )
                                                }
                                                onClick={e => handleDeleteRace(e, raceId)}
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
            </PanelSection>
            {/** Add Race Form Modal */}
            <AddRaceForm
                modalStates={modalStates}
                handleSetModalState={handleSetModalState}
                setRaces={setRaces}
                bikes={bikes}
                courses={courses}
            />
        </PanelContainer>
    );
};

export default RacePanel;
