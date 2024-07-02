import { Box, CircularProgress, CircularProgressLabel, Container, Flex, Heading, Image, Spinner, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { fetchDetails, imagePath, imagePathOriginal } from "../services/api"
import { CalendarIcon } from "@chakra-ui/icons"
import { ratingToPercentage, resolveRatingColor } from "../utils/helpers"


const DetailsPage = () => {
    const router = useParams()
    const { id, type } = router
    const [details, setDetails] = useState({})
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        fetchDetails(type, id).then((res) => { setDetails(res) }).catch((err) => console.log(err)).finally(() => setLoading(false))
    }, [type, id])
    if (loading) {
        return (
            <Flex justify={"center"}>
                <Spinner size={"xl"} color="red" />
            </Flex>
        );
    }
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(details?.release_date || details?.first_air_date).toLocaleDateString('pt-BR', options);

    return (
        <Box>
            <Box
                background={`linear-gradient(rgba(0,0,0,.88), rgba(0,0,0,.88)), url(${imagePathOriginal}/${details?.backdrop_path})`} backgroundRepeat={'no-repeat'} backgroundSize={'cover'} backgroundPosition={'center'} width={'100%'}
                h={{ base: 'auto', md: '500px' }} p={'2'} zIndex={'-1'} display={'flex'} alignItems={'center'}>
                <Container maxW={'container.xl'}>
                    <Flex alignItems={'center'} gap={'10'} flexDirection={{ base: "column", md: "row" }}>
                        <Image height={'450px'} borderRadius={'sm'}
                            src={`${imagePath}/${details?.poster_path}`} />
                        <Box>
                            <Heading fontSize={'3xl'}>{details.title || details.name} </Heading>
                            <Flex alignItems={"center"} gap={"4"} mt={1} mb={5}>
                                <Flex alignItems={"center"}
                                >
                                    <CalendarIcon mr={2} color={"gray.400"} />
                                    <Text fontSize={"sm"}>
                                        {formattedDate}
                                    </Text>
                                </Flex>
                            </Flex>
                            <Flex alignItems={'center'} gap={'4'}>
                                <CircularProgress
                                    value={ratingToPercentage(details?.vote_average)}
                                    bg={"gray.800"}
                                    borderRadius={"full"}
                                    p={"0.5"}
                                    size={"70px"}
                                    color={resolveRatingColor(details?.vote_average)}
                                    thickness={"6px"}
                                >
                                    <CircularProgressLabel fontSize={"lg"}>
                                            {ratingToPercentage(details?.vote_average)}
                                            <Box as='span' fontSize={'10px'}>%</Box>
                                    </CircularProgressLabel>
                                </CircularProgress>
                            </Flex>
                        </Box>
                    </Flex>
                </Container>
            </Box>
        </Box>
    )
}

export default DetailsPage