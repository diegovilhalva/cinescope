import { Container, Heading } from "@chakra-ui/react"


const Search = () => {
    return (
        <Container maxW={'container.xl'}>
            <Heading as={'h2'} fontSize={'md'} textTransform={'uppercase'}>Pesquisar</Heading>
        </Container>
    )
}

export default Search