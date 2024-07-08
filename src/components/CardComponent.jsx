import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { imagePath } from "../services/api";
import { StarIcon } from "@chakra-ui/icons";

const CardComponent = ({ item, type }) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };

  const getFormattedDate = (dateString) => {
      const date = new Date(dateString);
      const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
      return utcDate.toLocaleDateString('pt-BR', options);
  };
  
  const formattedDate = type !== "person" ? getFormattedDate(item?.release_date || item?.first_air_date) : null;
  
  
  

  return (
    <Link to={`/${type}/${item.id}`}>
      <Box
        position={'relative'}
        transform={'scale(1)'}
        _hover={{
          transform: { base: 'scale(1)', md: 'scale(1.08)' },
          zIndex: '10',
          transition: 'transform 0.2s ease-in-out',
          '& .overlay': {
            opacity: 1
          }
        }}
      >
        <Image
          src={`${imagePath}/${type === "person" ? item.profile_path : item.poster_path}`}
          alt={item?.title || item?.name}
          height={'100%'}
        />
        <Box
          className="overlay"
          position={'absolute'}
          p={'2'}
          bottom={'0'}
          left={'0'}
          width={'100%'}
          h={'33%'}
          bg="rgba(0,0,0,0.9)"
          opacity={'0'}
          transition={'opacity 0.3s ease-in-out'}
        >
          <Text textAlign={'center'}>{item?.title || item?.name}</Text>
          {type !== "person" && (
            <>
              <Text textAlign={'center'} fontSize={'small'} color={'green.200'}>
                {formattedDate}
              </Text>
              <Flex alignItems={"center"} justifyContent={"center"} gap={2} mt="2">
                <StarIcon fontSize={"small"} />
                <Text>{item?.vote_average?.toFixed(1)}</Text>
              </Flex>
            </>
          )}
          {type === "person" && (
            <Text textAlign={'center'} fontSize={'small'} color={'green.200'}>
              {item?.known_for_department}
            </Text>
          )}
        </Box>
      </Box>
    </Link>
  );
}

export default CardComponent;
