import { Box, Flex, Text, Link, IconButton, useColorMode } from '@chakra-ui/react';
import {  FaFacebook, FaInstagram} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
 

  return (
    
    <Box as="footer" width="100%" py={4} bg="#000" mt={'10'}>
      <Flex
        maxW="1200px"
        mx="auto"
        px={4}
        align="center"
        justify="space-between"
        flexDirection={['column', 'row']}
      >
        <Text fontSize="sm" color="white">
          © {new Date().getFullYear()} Cinescope. Todos os direitos reservados.
        </Text>
        <Flex mt={[4, 0]} align="center">
          <Link href="https://twitter.com" isExternal mx={2}>
            <IconButton
              aria-label="Twitter"
              icon={<FaXTwitter/>}
              variant="ghost"
              color="white"
            />
          </Link>
          <Link href="https://facebook.com" isExternal mx={2}>
            <IconButton
              aria-label="Facebook"
              icon={<FaFacebook />}
              variant="ghost"
              color="white"
            />
          </Link>
          <Link href="https://instagram.com" isExternal mx={2}>
            <IconButton
              aria-label="Instagram"
              icon={<FaInstagram />}
              variant="ghost"
              color="white"
            />
          </Link>
          
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
