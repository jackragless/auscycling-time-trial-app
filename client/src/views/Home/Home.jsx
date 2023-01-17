import React from "react";

import { Image, HStack } from "@chakra-ui/react";
import loginImage from "../../assets/images/signup-image.jpg";

const Home = () => {
    return (
        <HStack spacing={0}>
            <Image
                w="100vw"
                h="calc(100vh - 96px)"
                src={loginImage}
                objectFit="cover"
                objectPosition="left"
                alt="Login Page Image"
            />
        </HStack>
    );
};

export default Home;
