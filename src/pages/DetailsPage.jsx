import { Badge, Box, Button, CircularProgress, CircularProgressLabel, Container, Flex, Heading, Image, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCredits, fetchDetails, fetchVideos, imagePath, imagePathOriginal } from "../services/api";
import { CalendarIcon, CheckCircleIcon, SmallAddIcon, TimeIcon } from "@chakra-ui/icons";
import { minutesToHours, ratingToPercentage, resolveRatingColor } from "../utils/helpers";
import VideoComponent from "../components/VideoComponent";

const DetailsPage = () => {
    const { id, type } = useParams();
    const [details, setDetails] = useState({});
    const [cast, setCast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [video, setVideo] = useState(null);
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [detailsData, creditsData, videosData] = await Promise.all([fetchDetails(type, id), fetchCredits(type, id), fetchVideos(type, id)]);
                setDetails(detailsData);
                setCast(creditsData?.cast?.slice(0, 10));
                const video = videosData?.results?.find(
                    (video) => video?.type === "Trailer"
                );
                setVideo(video);
                const videos = videosData?.results
                    ?.filter((video) => video?.type !== "Trailer")
                    ?.slice(0, 10);
                setVideos(videos);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [type, id]);

    if (loading) {
        return (
            <Flex justify="center">
                <Spinner size="xl" color="red" />
            </Flex>
        );
    }

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(details?.release_date || details?.first_air_date).toLocaleDateString('pt-BR', options);

    return (
        <Box>
            <Box
                background={`linear-gradient(rgba(0,0,0,.88), rgba(0,0,0,.88)), url(${imagePathOriginal}/${details?.backdrop_path})`}
                backgroundRepeat="no-repeat"
                backgroundSize="cover"
                backgroundPosition="center"
                width="100%"
                h={{ base: 'auto', md: '500px' }}
                p="2"
                zIndex="-1"
                display="flex"
                alignItems="center"
            >
                <Container maxW="container.xl">
                    <Flex alignItems="center" gap="10" flexDirection={{ base: "column", md: "row" }}>
                        <Image height="450px" borderRadius="sm" src={`${imagePath}/${details?.poster_path}`} />
                        <Box>
                            <Heading fontSize="3xl">{details.title || details.name}</Heading>
                            <Flex alignItems="center" gap="4" mt={1} mb={5}>
                                <Flex alignItems="center">
                                    <CalendarIcon mr={2} color="gray.400" />
                                    <Text fontSize="sm">{formattedDate}</Text>
                                </Flex>
                            </Flex>
                            {type === "movie" && (
                                <>
                              
                                    <Flex alignItems={"center"} mt="-3" mb="2">
                                        <TimeIcon mr="2" color={"gray.400"} />
                                        <Text fontSize={"sm"}>
                                            {minutesToHours(details?.runtime)}
                                        </Text>
                                    </Flex>
                                </>
                            )}
                            <Flex alignItems="center" gap="4">
                                <CircularProgress
                                    value={ratingToPercentage(details?.vote_average)}
                                    bg="gray.800"
                                    borderRadius="full"
                                    p="0.5"
                                    size="70px"
                                    color={resolveRatingColor(details?.vote_average)}
                                    thickness="6px"
                                >
                                    <CircularProgressLabel fontSize="lg">
                                        {ratingToPercentage(details?.vote_average)}
                                        <Box as="span" fontSize="10px">%</Box>
                                    </CircularProgressLabel>
                                </CircularProgress>
                                <Text display={{ base: 'none', md: 'initial' }}>Aprovação do público</Text>
                                <Button leftIcon={<CheckCircleIcon />} colorScheme="green" variant="outline" display="none" onClick={() => console.log('click')}>
                                    Adicionado a minha lista
                                </Button>
                                <Button leftIcon={<SmallAddIcon />} colorScheme="gray" variant="outline" onClick={() => console.log('click')}>
                                    Adicionar a minha lista
                                </Button>
                            </Flex>
                            <Text color="gray.400" fontSize="small" my="5">{details?.tagline}</Text>
                            <Heading fontSize="xl" mb="3">Sinopse</Heading>
                            <Text fontSize="md" mb="3">{details?.overview}</Text>
                            <Flex mt="6" gap="2">
                                {details?.genres?.map((genre) => (
                                    <Badge key={genre?.id} p="1">{genre?.name}</Badge>
                                ))}
                            </Flex>
                        </Box>
                    </Flex>
                </Container>
            </Box>
            <Container maxW="container.xl" pb="10">
                <Heading as="h2" fontSize="lg" textTransform="uppercase" mt="10" mb="5">Elenco</Heading>
                <Flex
                    mt="5"
                    mb="10"
                    overflowX="auto"
                    gap="5"
                    py="5"
                    sx={{
                        '&::-webkit-scrollbar': {
                            height: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#111',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#ff0000',
                            borderRadius: '8px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: '#ff0011',
                        },
                    }}
                >
                    {cast?.length === 0 && <Text>Nenhum elenco encontrado</Text>}
                    {cast?.map((item) => (
                        <Box key={item?.id} minW="150px" maxW="200px" textAlign="center" boxShadow="md" borderRadius="md" overflow="hidden">
                            <Image src={`${imagePath}/${item?.profile_path}`} w="100%" h="225px" objectFit="cover" alt={item.name} />
                            <Box p="2">
                                <Text fontWeight="bold" fontSize="md">{item.name}</Text>
                                <Text fontSize="sm" color="gray.500">{item.character}</Text>
                            </Box>
                        </Box>
                    ))}
                </Flex>
                <Heading
                    as="h2"
                    fontSize={"md"}
                    textTransform={"uppercase"}
                    mt="10"
                    mb="5"
                >
                    Videos
                </Heading>
                <VideoComponent id={video?.key} />
                <Flex mt="5" mb="10" overflowX={"scroll"} gap={"5"} sx={{
                    '&::-webkit-scrollbar': {
                        height: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#111',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#ff0000',
                        borderRadius: '8px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: '#ff0011',
                    },
                }}>
                    {videos &&
                        videos?.map((item) => (
                            <Box key={item?.id} minW={"290px"}>
                                <VideoComponent id={item?.key} small />
                                <Text fontSize={"sm"} fontWeight={"bold"} mt="2" noOfLines={2}>
                                    {item?.name}{" "}
                                </Text>
                            </Box>
                        ))}
                </Flex>
            </Container>
        </Box>
    );
};

export default DetailsPage;
