import React from "react";
import {
    VStack,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Text,
} from "@chakra-ui/react";

const ParamSlider = ({ paramName, sliderValue, onChange, color }) => {
    return (
        <VStack w="250px" spacing={2}>
            <Slider
                aria-label="slider-ex-6"
                min={-50}
                max={50}
                onChange={onChange}
                colorScheme={color}
            >
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider>
            <Text>{`${paramName} ${sliderValue}%`}</Text>
        </VStack>
    );
};

export default ParamSlider;
