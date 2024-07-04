import { Container, Flex, Grid, Heading, Select, Skeleton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchMovies } from "../../services/api";
import CardComponent from "../../components/CardComponent";
import PaginationComponent from "../../components/PaginationComponent";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get("page") ? parseInt(searchParams.get("page"), 10) : 1;
    const sort = searchParams.get("sortBy") || "popularity.desc";
    setActivePage(page);
    setSortBy(sort);

    setLoading(true);
    fetchMovies(page, sort, sort === "vote_average.desc" ? 1000 : null)
      .then((res) => {
        setMovies(res?.results);
        setTotalPages(res?.total_pages);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [location.search]);

  const handlePageChange = (page) => {
    setActivePage(page);
    navigate(`?page=${page}&sortBy=${sortBy}`);
  };

  const handleSortChange = (e) => {
    const selectedSortBy = e.target.value;
    setSortBy(selectedSortBy);
    setActivePage(1); // Reset page to 1 when changing sort option
    navigate(`?page=1&sortBy=${selectedSortBy}`);
  };

  return (
    <Container maxW={'container.xl'}>
      <Flex alignItems={'baseline'} gap={'4'} my={10}>
        <Heading as={'h2'} fontSize={'md'} textTransform={'uppercase'} mb="1">descubra novos Filmes</Heading>
        <Select w={'150px'} value={sortBy} onChange={handleSortChange}>
          <option value="popularity.desc">Populares</option>
          <option value="vote_average.desc">Top Avaliados</option>
        </Select>
      </Flex>
      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
          lg: "repeat(5, 1fr)",
        }}
        gap={"4"}
      >
        {movies && movies.map((item, i) =>
          loading ? (
            <Skeleton height={300} key={i} />
          ) : (
            <CardComponent key={item?.id} item={item} type={"movie"} />
          )
        )}
      </Grid>
      <PaginationComponent activePage={activePage} totalPages={totalPages} setActivePage={handlePageChange} />
    </Container>
  );
};

export default Movies;
