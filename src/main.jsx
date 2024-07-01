import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import App from './App.jsx'
import './index.css'
import theme from '../theme.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path:"/",
        element:<div>Home</div>
      },
      {
        path:"/movies",
        element:<div>movies</div>
      },
      {
        path:'/shows',
        element:<div>tv shows</div>
      },
      {
        path:'/search',
        element:<div>Search</div>
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <RouterProvider router={router}/>
      </ChakraProvider>
  </React.StrictMode>,
)
