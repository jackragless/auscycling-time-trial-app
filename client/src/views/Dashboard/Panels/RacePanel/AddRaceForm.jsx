import React from "react";
import { RaceService, CourseService, BikeService } from "../../../../services";
import { auth } from "../../../../services/Firebase/Firebase.service";

import { useForm } from "react-hook-form";
import { Modal } from "../../../../components/Layouts";
import {
    BikeField,
    CourseField,
    HumidityField,
    RaceNameField,
    RaceTypeField,
    RoadConditionField,
    TemperatureField,
    TerrainField,
    WindDirectionField,
    WindSpeedField,
} from "./FormFields";
import { VStack, HStack, useDisclosure, useToast } from "@chakra-ui/react";

const AddRaceForm = ({ modalStates, handleSetModalState, setRaces, bikes, courses }) => {
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            bike: "",
            course: "",
            humidity: 0,
            raceName: "",
            raceType: "",
            roadCondition: "",
            temperature: 0,
            terrain: "",
            windDirection: "",
            windSpeed: 0,
        },
    });
    const { onClose } = useDisclosure();

    const toast = useToast();

    // Function for submitting form data to the backend.
    const onSubmit = async values => {
        const {
            bike,
            course,
            humidity,
            raceName,
            raceType,
            roadCondition,
            temperature,
            terrain,
            windDirection,
            windSpeed,
        } = values;

        console.log(values);

        try {
            const bikeRef = await BikeService.getBikeById(bike);
            const courseRef = await CourseService.getCourseById(course);

            const res = await RaceService.addRace(
                auth?.currentUser.uid,
                bike,
                bikeRef?.data?.bike.bikeName,
                course,
                courseRef.data?.course.course_name,
                courseRef.data?.course.course_distance,
                humidity,
                raceName,
                raceType,
                roadCondition,
                temperature,
                terrain,
                windDirection,
                windSpeed
            );
            await new Promise(res => setTimeout(res, 250));

            setRaces(curRaces => ({ ...curRaces, [res.data.id]: res.data.race }));

            toast({
                position: "bottom-left",
                description: res.message,
                status: "success",
                duration: 5000,
                isClosable: true,
                containerStyle: {
                    pb: 6,
                    pl: 6,
                    m: 0,
                },
            });
        } catch (err) {
            const { data } = err.response;

            // Notifies the user of an unsuccessful request.
            toast({
                position: "bottom-left",
                description: `${data}`,
                status: "error",
                duration: 5000,
                isClosable: true,
                containerStyle: {
                    pb: 6,
                    pl: 6,
                    m: 0,
                },
            });
        } finally {
            handleModalClose();
        }
    };

    const handleModalClose = () => {
        reset({
            bike: "",
            course: "",
            humidity: 0,
            raceName: "",
            raceType: "",
            roadCondition: "",
            temperature: 0,
            terrain: "",
            windDirection: "",
            windSpeed: 0,
        });
        onClose();
        handleSetModalState("addModal", false);
    };

    return (
        <Modal
            title="Add Course"
            isOpen={modalStates["addModal"]}
            onClose={handleModalClose}
            onSuccessText="Add Course"
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            size="6xl"
        >
            <VStack w="100%" spacing={6}>
                {/** First Row */}
                <HStack w="100%" spacing={6} alignItems="flex-start">
                    <RaceNameField register={register} errors={errors} />
                    <RaceTypeField register={register} errors={errors} />
                </HStack>

                {/** Second Row */}
                <HStack w="100%" spacing={6} alignItems="flex-start">
                    <BikeField register={register} errors={errors} bikes={bikes} />
                    <CourseField register={register} errors={errors} courses={courses} />
                </HStack>

                {/** Third Row */}
                <HStack w="100%" spacing={6} alignItems="flex-start">
                    <HumidityField register={register} errors={errors} />
                    <RoadConditionField register={register} errors={errors} />
                </HStack>

                {/** Fourth Row */}
                <HStack w="100%" spacing={6} alignItems="flex-start">
                    <WindDirectionField register={register} errors={errors} />
                    <WindSpeedField register={register} errors={errors} />
                </HStack>

                {/** Fifth Row */}
                <HStack w="100%" spacing={6} alignItems="left">
                    <TemperatureField register={register} errors={errors} />
                    <TerrainField register={register} errors={errors} />
                </HStack>
            </VStack>
        </Modal>
    );
};

export default AddRaceForm;
