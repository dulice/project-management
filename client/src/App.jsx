import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, useMediaQuery } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { createUploadLink } from 'apollo-upload-client'
import { Calendar, Employee, Home, Project, ProjectAdd, Projects, SignIn, Tasks } from "./pages";
import { Header, Sidebar } from "./components";

function App() {
  const graphqlURI = process.env.REACT_APP_GRAPHQL_URI || "http://localhost:5000/graphql";
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: createUploadLink({
      uri: graphqlURI
    })
  });

  const isMobile = useMediaQuery('(max-width: 600px)');
  const drawerWidth = isMobile ? 50 : 200;

  return (
    <>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Box sx={{ dispaly: "flex" }}>
          <CssBaseline />
          <Sidebar isMobile={isMobile}/>
          <Box sx={{width: `calc(100% - ${drawerWidth}px)`,ml: `${drawerWidth}px`}}>
            <Header />
            <Container>
            <Routes>
              <Route path="/" element={<Home  isMobile={isMobile}/>} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<Project />} />
              <Route path="/projectAdd" element={<ProjectAdd />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/employee" element={<Employee />} />
            </Routes>
            </Container>
          </Box>
          <ToastContainer position="top-center"/>
        </Box>
      </BrowserRouter>
    </ApolloProvider>
    </>
  );
}

export default App;
