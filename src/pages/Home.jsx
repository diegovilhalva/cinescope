import { Box, Container, Flex, Grid, Heading, Skeleton } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { fetchTrending } from "../services/api"
import CardComponent from "../components/CardComponent"

const Home = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [timeWindow, setTimeWindow] = useState('day')
    
    useEffect(() => {
        fetchTrending(timeWindow).then((res) => {
            setLoading(true)
            setData(res)
        }).catch((err) => console.log(err)).finally(() => {
            setLoading(false)
        })
    }, [timeWindow])

    return (
        <Container maxW={'container.xl'}>
            <Flex alignItems={'baseline'} gap={4} my={10} flexWrap="wrap">
                <Heading as={'h2'} fontSize={{ base: 'lg', md: 'xl' }} textTransform={'uppercase'}>
                    Tendências
                </Heading>
                <Flex alignItems={'center'} gap={2} border={'1px solid teal'} borderRadius={'20px'} flexWrap="wrap">
                    <Box
                        as='button'
                        px={3}
                        py={1}
                        borderRadius={'20px'}
                        onClick={() => setTimeWindow('day')}
                        bg={timeWindow === 'day' ? 'teal.500' : 'gray.700'}
                        color={timeWindow === 'day' ? 'white' : 'gray.300'}
                        _hover={{ bg: timeWindow === 'day' ? 'teal.400' : 'gray.600' }}
                    >
                        Hoje
                    </Box>
                    <Box
                        as='button'
                        px={3}
                        py={1}
                        borderRadius={'20px'}
                        onClick={() => setTimeWindow('week')}
                        bg={timeWindow === 'week' ? 'teal.500' : 'gray.700'}
                        color={timeWindow === 'week' ? 'white' : 'gray.300'}
                        _hover={{ bg: timeWindow === 'week' ? 'teal.400' : 'gray.600' }}
                    >
                        Nesta Semana
                    </Box>
                </Flex>
            </Flex>
          
            <Grid templateColumns={{ base: "1fr", sm: "repeat(2,1fr)", md: "repeat(4,1fr)", lg: "repeat(5,1fr)" }} gap={4}>
                {data &&
                    data.map((item, i) =>
                        loading ? (
                            <Skeleton height={300} key={i} />
                        ) : (
                            <CardComponent
                                key={item.id}
                                item={item}
                                type={item.media_type}
                            />
                        )
                    )
                }
            </Grid>
        </Container>
    )
}

export default Home
