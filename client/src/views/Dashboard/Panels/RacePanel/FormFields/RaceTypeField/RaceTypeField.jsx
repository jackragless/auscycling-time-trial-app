import React from "react";

import { FormControl, FormLabel, Select, FormErrorMessage } from "@chakra-ui/react";

const RaceTypeField = ({ register, errors }) => {
    return (
        <FormControl isInvalid={errors.raceType}>
            <FormLabel>Race Type</FormLabel>
            <Select
                id="raceType"
                bg="gray.50"
                {...register("raceType", {
                    required: "This is required.",
                    validate: value => value !== "" || "Please select a valid choice.",
                })}
            >
                <option value="">Select Type</option>
                <option value="Triathlon">Triathlon</option>
                <option value="Time Trial">Time Trial</option>
                <option value="Road Race">Road Race</option>
                <option value="Mountain Bike">Mountain Bike</option>
                <option value="Other">Other</option>
            </Select>
            <FormErrorMessage>
                {errors.raceType && errors.raceType.message}
            </FormErrorMessage>
        </FormControl>
    );
};

export default RaceTypeField;
