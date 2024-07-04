import { Button, Flex, Text } from "@chakra-ui/react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const PaginationComponent = ({ activePage, totalPages, setActivePage }) => {
    return (
        <Flex
            gap={{ base: "1", md: "2" }}
            alignItems="center"
            flexWrap="wrap"
            justifyContent="center"
            mt="10"
        >
            <Flex gap={{ base: "1", md: "2" }} maxW="250px" my="4">
                <Button
                    leftIcon={<FiArrowLeft />}
                    onClick={() => setActivePage(activePage - 1)}
                    isDisabled={activePage === 1}
                >
                    Anterior
                </Button>
                <Button
                    rightIcon={<FiArrowRight />}
                    onClick={() => setActivePage(activePage + 1)}
                    isDisabled={activePage === totalPages}
                >
                    Próxima
                </Button>
            </Flex>
            <Flex
                gap={{ base: "1", md: "2" }}
                alignItems="center"
                fontSize={{ base: "sm", md: "md" }}
            >
                <Text>{activePage}</Text>
                <Text>de</Text>
                <Text>{totalPages}</Text>
            </Flex>
        </Flex>
    );
};

export default PaginationComponent;
