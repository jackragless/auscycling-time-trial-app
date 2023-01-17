import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { BikeService } from "../../../../services";

import AddBikeForm from "./AddBikeForm";
import EditBikeForm from "./EditBikeForm";
import { PanelContainer, PanelSection } from "../../../../components/Layouts";
import { Table } from "../../../../components/StructuredData";
import {
    Button,
    IconButton,
    Box,
    Tr,
    Td,
    HStack,
    Spinner,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { RiSearchLine, RiDeleteBinLine, RiPencilFill } from "react-icons/ri";
import { auth } from "../../../../services/Firebase/Firebase.service";

const columns = [
    "Name",
    "Type",
    "Weight (kg)",
    "Components",
    "Rolling Resistance",
    "Mechanical Loss",
    "",
];

const BikePanel = ({ bikes, setBikes }) => {
    const [modalStates, setModalStates] = useState({
        addModal: false,
        editModal: false,
    });
    const [curSelectedBike, setCurSelectedBike] = useState(null);

    const toast = useToast();
    const { onClose } = useDisclosure();

    // Handles the modal render states.
    const handleSetModalState = (modalName, state) => {
        setModalStates(curStates => ({ ...curStates, [modalName]: state }));
    };

    // Fetches a bike by its ID.
    const handleEditBike = async (e, bikeId) => {
        const { id } = e.currentTarget;

        handleSetModalState(id, true);
        try {
            const res = await BikeService.getBikeById(bikeId);
            await new Promise(res => setTimeout(res, 250));

            setCurSelectedBike(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            handleSetModalState(id, false);
            handleSetModalState("editModal", true);
        }
    };

    // Delete a bike by its ID.
    const handleDeleteBike = async (e, bikeId) => {
        const { id } = e.currentTarget;

        handleSetModalState(id, true);
        try {
            const res = await BikeService.deleteBike(bikeId);
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
            setBikes(curBikes => {
                delete curBikes[bikeId];
                return { ...curBikes };
            });
        } catch (err) {
            console.log(err);
        } finally {
            handleSetModalState(id, false);
        }
    };

    const navigate = useNavigate();
    const navigateBike = async bikeId => {
        const username = auth?.currentUser.displayName.split(" ").join("").toLowerCase();

        navigate("/" + username + "/bike/" + bikeId);
    };

    return (
        <PanelContainer>
            <PanelSection title="Bike Form">
                <Box px={6} py={8}>
                    <Button
                        colorScheme="blue"
                        onClick={() => handleSetModalState("addModal", true)}
                    >
                        Add Bike
                    </Button>
                </Box>
            </PanelSection>
            {/** Table of bike data. */}
            <PanelSection title="Bikes">
                <Table columns={columns}>
                    {Object?.keys(bikes)?.length > 0 ? (
                        <Fragment>
                            {Object?.keys(bikes)?.map(bikeId => (
                                <Tr key={bikeId}>
                                    <Td>{bikes[bikeId].bikeName}</Td>
                                    <Td>{bikes[bikeId].bikeType}</Td>
                                    <Td>{bikes[bikeId].bikeWeight}</Td>
                                    <Td>{bikes[bikeId].bikeComponent} End</Td>
                                    <Td>{bikes[bikeId].rollingResistance}</Td>
                                    <Td>{bikes[bikeId].mechanicalLoss}</Td>
                                    <Td>
                                        <HStack
                                            w="100%"
                                            spacing={4}
                                            justifyContent="flex-end"
                                        >
                                            <IconButton
                                                id={`view-${bikeId}`}
                                                colorScheme="blue"
                                                variant="outline"
                                                icon={<RiSearchLine size="20px" />}
                                                onClick={() => navigateBike(bikeId)}
                                            />
                                            <IconButton
                                                id={`edit-${bikeId}`}
                                                colorScheme="purple"
                                                variant="outline"
                                                icon={
                                                    modalStates[`edit-${bikeId}`] ? (
                                                        <Spinner />
                                                    ) : (
                                                        <RiPencilFill size="20px" />
                                                    )
                                                }
                                                onClick={e => {
                                                    handleEditBike(e, bikeId);
                                                }}
                                            />
                                            <IconButton
                                                id={`delete-${bikeId}`}
                                                colorScheme="red"
                                                icon={
                                                    modalStates[`delete-${bikeId}`] ? (
                                                        <Spinner />
                                                    ) : (
                                                        <RiDeleteBinLine size="20px" />
                                                    )
                                                }
                                                onClick={e => handleDeleteBike(e, bikeId)}
                                            />
                                        </HStack>
                                    </Td>
                                </Tr>
                            ))}
                        </Fragment>
                    ) : (
                        <Tr>
                            <Td colSpan={7}>No bikes available.</Td>
                        </Tr>
                    )}
                </Table>
            </PanelSection>
            {/** Add Bike Form Modal */}
            <AddBikeForm
                modalStates={modalStates}
                handleSetModalState={handleSetModalState}
                setBikes={setBikes}
            />
            {/** Edit Bike Form Modal */}
            <EditBikeForm
                modalStates={modalStates}
                handleSetModalState={handleSetModalState}
                setBikes={setBikes}
                curSelectedBike={curSelectedBike}
                onClose={onClose}
            />
        </PanelContainer>
    );
};

export default BikePanel;
