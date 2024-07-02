import { Box, Image } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { imagePath } from "../services/api"


const CardComponent = ({item}) => {
  return (
    <Link to={'/'}>
        <Box>
            <Image src={`${imagePath}/${item.poster_path}`}/>
        </Box>
    </Link>
  )
}

export default CardComponent