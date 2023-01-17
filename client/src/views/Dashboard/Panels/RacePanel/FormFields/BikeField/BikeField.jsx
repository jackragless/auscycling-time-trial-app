import React from "react";

import { FormControl, FormLabel, Select, FormErrorMessage } from "@chakra-ui/react";

const BikeField = ({ register, errors, bikes }) => {
    return (
        <FormControl isInvalid={errors.bike}>
            <FormLabel>Bike</FormLabel>
            <Select
                id="bike"
                bg="gray.50"
                {...register("bike", {
                    required: "This is required.",
                    validate: value => value !== "" || "Please select a valid choice.",
                })}
            >
                <option value="">Select Bike</option>
                {Object.keys(bikes)?.map(bikeId => (
                    <option key={bikeId} value={bikeId}>
                        {bikes[bikeId].bikeName}
                    </option>
                ))}
            </Select>
            <FormErrorMessage>{errors.bike && errors.bike.message}</FormErrorMessage>
        </FormControl>
    );
};

export default BikeField;
