import React, { Fragment, useState } from "react";
import { CourseService } from "../../../../services";

import CourseUpload from "./CourseUpload";
import { PanelContainer, PanelSection } from "../../../../components/Layouts";
import { Table } from "../../../../components/StructuredData";
import {
    Alert,
    AlertIcon,
    Tr,
    Td,
    IconButton,
    useToast,
    Spinner,
    HStack,
} from "@chakra-ui/react";
import { RiDeleteBinLine } from "react-icons/ri";

const columns = [
    "Course",
    "Distance (km)",
    "City",
    "State/Province",
    "Country",
    "Visibility",
    "",
];

const CoursePanel = ({ courses, setCourses }) => {
    const [buttonStates, setButtonStates] = useState({});

    const toast = useToast();

    // Handles the modal render states.
    const handleSetButtonState = (modalName, state) => {
        setButtonStates(curStates => ({ ...curStates, [modalName]: state }));
    };

    // Deletes a course by its ID.
    const handleDeleteCourse = async (e, courseId) => {
        const { id } = e.currentTarget;

        handleSetButtonState(id, true);
        try {
            const res = await CourseService.deleteCourse(courseId);
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

            // Instead of re-retrieving everything, just remove the course in state.
            setCourses(curCourses => {
                delete curCourses[courseId];
                return { ...curCourses };
            });
        } catch (err) {
            console.log(err);
        } finally {
            handleSetButtonState(id, false);
        }
    };

    return (
        <PanelContainer>
            {/** Alert if no courses exist */}
            {Object.keys(courses).length <= 0 && (
                <Alert status="info" variant="subtle" rounded="xl">
                    <AlertIcon />
                    Upload a course to start.
                </Alert>
            )}
            {/** Form to upload a course. */}
            <CourseUpload setCourses={setCourses} />
            {/** Table of course data. */}
            <PanelSection title="Courses">
                <Table columns={columns}>
                    {Object.keys(courses)?.length > 0 ? (
                        <Fragment>
                            {Object.keys(courses).map(courseId => (
                                <Tr key={courseId}>
                                    <Td>{courses[courseId].course_name}</Td>
                                    <Td>
                                        {courses[courseId].course_distance?.toFixed(2)}
                                    </Td>
                                    <Td>
                                        {courses[courseId].course_address?.city || "--"}
                                    </Td>
                                    <Td>
                                        {courses[courseId].course_address?.state ||
                                            courses[courseId].course_address?.province}
                                    </Td>
                                    <Td>{courses[courseId].course_address?.country}</Td>
                                    <Td>{courses[courseId].course_visibility}</Td>
                                    <Td>
                                        <HStack
                                            w="100%"
                                            spacing={4}
                                            justifyContent="flex-end"
                                        >
                                            <IconButton
                                                id={`delete-${courseId}`}
                                                colorScheme="red"
                                                icon={
                                                    buttonStates[`delete-${courseId}`] ? (
                                                        <Spinner />
                                                    ) : (
                                                        <RiDeleteBinLine size="20px" />
                                                    )
                                                }
                                                onClick={e =>
                                                    handleDeleteCourse(e, courseId)
                                                }
                                            />
                                        </HStack>
                                    </Td>
                                </Tr>
                            ))}
                        </Fragment>
                    ) : (
                        <Tr>
                            <Td colSpan={6}>No courses available.</Td>
                        </Tr>
                    )}
                </Table>
            </PanelSection>
        </PanelContainer>
    );
};

export default CoursePanel;
