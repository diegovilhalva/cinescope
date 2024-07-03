import { Box, Text } from "@chakra-ui/react";

const VideoComponent = ({ id, small }) => {
  if (!id) {
    return (
      <Box width="100%" height={small ? "150px" : "500px"} display="flex" alignItems="center" justifyContent="center" bg="gray.800">
        <Text color="white">Erro:  vídeo não encontrado</Text>
      </Box>
    );
  }

  return (
    <iframe
      width="100%"
      height={small ? "150" : "500"}
      src={`https://www.youtube.com/embed/${id}?rel=0&showinfo=0&enablejsapi=1`}
      title="YouTube video player"
      allowFullScreen
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.insertAdjacentHTML('afterend', '<div style="color: white; background-color: gray; text-align: center; padding: 10px;">Erro ao carregar o vídeo</div>');
      }}
    ></iframe>
  );
};

export default VideoComponent;
