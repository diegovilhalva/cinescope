import { Button, Container, Flex, Grid, Heading, Input, Skeleton, Spinner } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { searchData } from "../../services/api"
import CardComponent from "../../components/CardComponent"
import PaginationComponent from "../../components/PaginationComponent"


const Search = () => {
    const [searchValue, setSearchValue] = useState("")
      const [tempSearchValue, setTempSearchValue] = useState("")
    const [activePage, setActivePage] = useState(1)
     const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])

    useEffect(() => {
        setLoading(true)
        searchData(searchValue, activePage).then((res) => {
            setData(res?.results)
            setActivePage(res?.page);
            setTotalPages(res?.total_pages);
        }).catch((err) => console.log(err)).finally(() => {
            setLoading(false)
        })
    },[searchValue,activePage])

    const handleSearch = (e) => {
        e.preventDefault()
        setSearchValue(tempSearchValue)
    }

    return (
        <Container maxW={'container.xl'}>
            <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
                <Heading as="h2" fontSize={"md"} textTransform={"uppercase"}>
                    Pesquisar
                </Heading>
            </Flex>

            <form onSubmit={handleSearch}>
                <Input
                    placeholder="Buscar filmes e séries..."
                    _placeholder={{ color: 'gray.300' }}
                    value={tempSearchValue}
                    onChange={(e) => setTempSearchValue(e.target.value)}
                />

            </form>
            {loading && (
                <Flex justifyContent={"center"} mt="10">
                    <Spinner size={"xl"} color="red" />
                </Flex>
            )}

            {data?.length === 0 && !loading && (
                <Heading textAlign={"center"} as="h3" fontSize={"sm"} mt="10">
                    Nenhum resultado encontrado
                </Heading>
            )}

            <Grid
                templateColumns={{
                    base: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(4, 1fr)",
                    lg: "repeat(5, 1fr)",
                }}
                gap={"4"}
                mt="6"
            >
                {data?.length > 0 &&
                    !loading &&
                    data?.map((item, i) =>
                        loading ? (
                            <Skeleton height={300} key={i} />
                        ) : (
                            <CardComponent
                                key={item?.id}
                                item={item}
                                type={item?.media_type}
                            />
                        )
                    )}
            </Grid>
            {data?.length > 0 && !loading && (
                <PaginationComponent
                    activePage={activePage}
                    totalPages={totalPages}
                    setActivePage={setActivePage}
                />
            )}

        </Container>
    )
}

export default Search