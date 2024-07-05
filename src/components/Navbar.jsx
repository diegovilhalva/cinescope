import { Avatar, Box, Button, Container, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, useDisclosure } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/useAuth"
import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons"



const Navbar = () => {
    const { user, signInWithGoogle, logout } = useAuth()
    const { onOpen, isOpen, onClose } = useDisclosure();
    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle()

        } catch (error) {
            console.log(error)
        }
    }

 
    return (
        <Box py="4" mb="mb-2">
            <Container maxW={'container.xl'}>
                <Flex justifyContent={'space-between'}>
                    <Link to='/' >
                        <Box fontSize={'2xl'} fontWeight={'bold'} color={'red'}
                            letterSpacing={'widest'} fontFamily={'mono'}>
                            CINESCOPE
                        </Box>
                    </Link>
                    <Flex gap={'4'} alignItems={'center'} display={{base:'none',md:'flex'}}>
                        <Link to='/'>Home</Link>
                        <Link to='/movies'>Filmes</Link>
                        <Link to='/shows'>Séries</Link>
                        <Link to='/search'><SearchIcon fontSize={'xl'}/></Link>
                        {user && (
                            <Menu>
                                <MenuButton>
                                    <Avatar bg={'red.500'} color={'white'} size={'sm'} name={user?.displayName} />
                                </MenuButton>
                                <MenuList>
                                    <Link to={'/watchlist'}>
                                        <MenuItem>
                                            Minha Lista
                                        </MenuItem>
                                        <MenuItem onClick={logout}>
                                            Sair
                                        </MenuItem>
                                    </Link>
                                </MenuList>
                            </Menu>
                        )}
                         {
                        !user && (
                            <Avatar size={'sm'} bg={'gray.800'} as={'button'} onClick={handleGoogleLogin}/>
                        )
                    }
                    </Flex>
                    <Flex
            display={{ base: "flex", md: "none" }}
            alignItems={"center"}
            gap="4"
          >
            <Link to="/search">
              <SearchIcon fontSize={"xl"} />
            </Link>
            <IconButton onClick={onOpen} icon={<HamburgerIcon />} />
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
              <DrawerOverlay />
              <DrawerContent bg={"black"}>
                <DrawerCloseButton />
                <DrawerHeader>
                  {user ? (
                    <Flex alignItems="center" gap="2">
                      <Avatar bg="red.500" size={"sm"} name={user?.email} />
                      <Box fontSize={"sm"}>
                        {user?.displayName || user?.email}
                      </Box>
                    </Flex>
                  ) : (
                    <Avatar
                      size={"sm"}
                      bg="gray.800"
                      as="button"
                      onClick={handleGoogleLogin}
                    />
                  )}
                </DrawerHeader>

                <DrawerBody>
                  <Flex flexDirection={"column"} gap={"4"} onClick={onClose}>
                    <Link to="/">Home</Link>
                    <Link to="/movies">Filmes</Link>
                    <Link to="/shows">Séries</Link>
                    {user && (
                      <>
                        <Link to="/watchlist">Minha Lista</Link>
                        <Button
                          variant={"outline"}
                          colorScheme="red"
                          onClick={logout}
                        >
                          Sair
                        </Button>
                      </>
                    )}
                  </Flex>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </Flex>
                   
                </Flex>
            </Container>
        </Box>
    )
}

export default Navbar