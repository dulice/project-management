import React from "react";
import { useQuery } from "@apollo/client";
import { Error, Loading, ProjectCard } from "../components";
import { GET_PROJECTS } from "../services/queries";
import { Avatar, Box, Grid, IconButton } from "@mui/material";
import { Add } from "@mui/icons-material";
import { orange } from "@mui/material/colors";
import { Link } from "react-router-dom";

const Projects = () => {
  const { data, loading, error } = useQuery(GET_PROJECTS);

  if (loading) return <Loading />;
  if (error) return <Error />;
  return (
    <>
      <Box sx={{float: "right"}}>
        <Link to="/projectAdd">
          <Avatar sx={{bgcolor: orange[500]}}><Add /></Avatar>
        </Link>
      </Box>
      <Grid container spacing={3}>
        {!loading &&
          !error &&
          data.projects.map((project) => (
            <Grid key={project.id} item xs={12} sm={6} md={4}>
              <ProjectCard project={project} />
            </Grid>
          ))}
      </Grid>
    </>
  );
};

export default Projects;
