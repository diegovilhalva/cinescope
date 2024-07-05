import { Badge, Box, Button, CircularProgress, CircularProgressLabel, Container, Flex, Heading, Image, Spinner, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCredits, fetchDetails, fetchVideos, getPersonDetails, imagePath, imagePathOriginal } from "../services/api";
import { CalendarIcon, CheckCircleIcon, ExternalLinkIcon, SmallAddIcon, TimeIcon } from "@chakra-ui/icons";
import { minutesToHours, ratingToPercentage, resolveRatingColor } from "../utils/helpers";
import VideoComponent from "../components/VideoComponent";
import { useAuth } from "../context/useAuth";
import { useFirestore } from "../services/firestore";

const DetailsPage = () => {
    const { id, type } = useParams();
    const { user } = useAuth()
    const { addToWatchList, checkIfInWatchlist,removeFromWatchlist } = useFirestore()
    const toast = useToast()
    const [details, setDetails] = useState({});
    const [cast, setCast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isInWatchList, setIsInWatchList] = useState(false)
    const [video, setVideo] = useState(null);
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let detailsData, creditsData, videosData;

                if (type === "person") {
                    detailsData = await getPersonDetails(id);

                } else {
                    [detailsData, creditsData, videosData] = await Promise.all([fetchDetails(type, id), fetchCredits(type, id), fetchVideos(type, id)]);
                }

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


    const handleSaveToWatchList = async () => {

        if (!user) {
            toast({
                title: "Faça login para adicionar minha lista",
                status: "error",
                isClosable: true,
            })
            return;
        }
        const data = {
            id: details?.id,
            title: details?.title || details?.name,
            type: type,
            poster_path: details?.poster_path,
            release_date: details?.release_date || details?.first_air_date,
            vote_average: details?.vote_average,
            overview: details?.overview
        }
        const dataId = details?.id?.toString();

        await addToWatchList(user?.uid, dataId, data)

        const isSetToWatchlist = await checkIfInWatchlist(user?.uid, dataId)
        setIsInWatchList(isSetToWatchlist)

    }
    useEffect(() => {
        if (!user) {
            setIsInWatchList(false)
            return
        }
        checkIfInWatchlist(user?.uid,id).then((data) => {
            setIsInWatchList(data)
        })

    },[id,user])

    const handleRemoveFromWatchlist = async () => {
        await removeFromWatchlist(user?.uid, id);
        const isSetToWatchlist = await checkIfInWatchlist(user?.uid, id);
        setIsInWatchList(isSetToWatchlist);
      };
    if (loading) {
        return (
            <Flex justify="center">
                <Spinner size="xl" color="red" />
            </Flex>
        );
    }

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = type !== "person" ? new Date(details?.release_date || details?.first_air_date).toLocaleDateString('pt-BR', options) : null;



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
                        <Image height="450px" borderRadius="sm" src={`${imagePath}/${type === "person" ? details?.profile_path : details?.poster_path}`} />
                        <Box>
                            <Heading fontSize="3xl">{details.title || details.name}</Heading>
                            {formattedDate && (
                                <Flex alignItems="center" gap="4" mt={1} mb={5}>
                                    <Flex alignItems="center">
                                        <CalendarIcon mr={2} color="gray.400" />
                                        <Text fontSize="sm">{formattedDate}</Text>
                                    </Flex>
                                </Flex>
                            )}
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
                            {type !== 'person' && (
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
                                    {isInWatchList ? (<Button leftIcon={<CheckCircleIcon />} colorScheme="green" variant="outline" onClick={handleRemoveFromWatchlist}>
                                        Adicionado a minha lista
                                    </Button>) : (
                                        <Button leftIcon={<SmallAddIcon />} colorScheme="gray" variant="outline" onClick={handleSaveToWatchList}>
                                            Adicionar a minha lista
                                        </Button>
                                    )}


                                </Flex>
                            )

                            }
                            {type === "person" && (
                                <>

                                    {details?.birthday && (
                                        <Flex alignItems="center" mt="2">
                                            <CalendarIcon mr={2} color="gray.400" />
                                            <Text>Data de Nascimento: {new Date(details?.birthday).toLocaleDateString('pt-BR', options)}</Text>
                                        </Flex>
                                    )}
                                    {details?.biography && (
                                        <>
                                            <Heading fontSize="xl" mt="4">Biografia</Heading>
                                            <Text fontSize="md" mt="2">{details?.biography}</Text>
                                        </>
                                    )}
                                    {details?.external_ids?.twitter_id && (
                                        <Button
                                            mt="4"
                                            leftIcon={<ExternalLinkIcon />}
                                            colorScheme="twitter"
                                            variant="link"
                                            as="a"
                                            href={`https://twitter.com/${details?.external_ids?.twitter_id}`}
                                            target="_blank"
                                        >
                                            Twitter
                                        </Button>
                                    )}
                                    {details?.external_ids?.instagram_id && (
                                        <Button
                                            mt="2"
                                            leftIcon={<ExternalLinkIcon />}
                                            colorScheme="purple"
                                            variant="link"
                                            as="a"
                                            href={`https://instagram.com/${details?.external_ids?.instagram_id}`}
                                            target="_blank"
                                        >
                                            Instagram
                                        </Button>
                                    )}
                                </>
                            )}
                            <Text color="gray.400" fontSize="small" my="5">{type !== "person" ? details?.tagline : null}</Text>
                            {type !== "person" && (
                                <>
                                    <Heading fontSize="xl" mb="3">Sinopse</Heading>
                                    <Text fontSize="md" mb="3">{details?.overview}</Text>
                                    <Flex mt="6" gap="2">
                                        {details?.genres?.map((genre) => (
                                            <Badge key={genre?.id} p="1">{genre?.name}</Badge>
                                        ))}
                                    </Flex>
                                </>
                            )}
                        </Box>
                    </Flex>
                </Container>
            </Box>
            <Container maxW="container.xl" pb="10">
                {cast && <Heading as="h2" fontSize="lg" textTransform="uppercase" mt="10" mb="5">Elenco</Heading>}
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
                {videos && <Heading
                    as="h2"
                    fontSize={"md"}
                    textTransform={"uppercase"}
                    mt="10"
                    mb="5"
                >
                    Videos
                </Heading>}
                {type !== "person" && <> <VideoComponent id={video?.key} />
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
                        {type !== "person" && videos &&
                            videos?.map((item) => (
                                <Box key={item?.id} minW={"290px"}>
                                    <VideoComponent id={item?.key} small />
                                    <Text fontSize={"sm"} fontWeight={"bold"} mt="2" noOfLines={2}>
                                        {item?.name}{" "}
                                    </Text>
                                </Box>
                            ))}
                    </Flex>
                </>}
            </Container>
        </Box>
    );
};

export default DetailsPage;
