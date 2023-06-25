import { useQuery } from "@apollo/client";
import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { GET_PROJECTS, TASKS } from "../services/queries";
import { Error, Loading, MyTask, ProjectCard } from "../components";
import { useNavigate } from "react-router-dom";
import { Calendar } from "react-big-calendar";
import { localizer } from "./Calendar";
import "./calendar.css";
import {
  CheckCircle,
  CheckCircleOutline,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
const Home = ({ isMobile }) => {
  const [filterTasks, setFilterTasks] = useState([])
  const employeeId = localStorage.getItem("employeeId");
  const { data, loading, error } = useQuery(GET_PROJECTS);
  const { data: tasks, loading: isLoading, error: isError} = useQuery(TASKS); 

  useEffect(() => {
    const fetchTasks = async () => {
      if(!isLoading && !isError) {
        const filterTasks = tasks.tasks.filter(task => task.user.id.includes(employeeId))
        setFilterTasks(filterTasks);
      }
    }
    fetchTasks();
  },[tasks?.tasks.length]);

  const navigate = useNavigate();
  if (loading || isLoading) return <Loading />;
  if (error || isError) return <Error />;
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} className={`${!isMobile && "scroll"}`}>
          {data.projects.map((project) => (
            <ProjectCard project={project} key={project.id} />
          ))}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            My Tasks ({filterTasks.length})
          </Typography>
          {filterTasks.length < 1 ? (
            <Alert severity="info">No Task Found</Alert>
          ) : (
            filterTasks.map((task, index) => (
              <MyTask task={task} index={index} key={task.id} />
            ))
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Calendar
            localizer={localizer}
            style={{ height: 300 }}
            components={{
              toolbar: CustomToolbar,
            }}
            onView={() => navigate("/calendar")}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;

const CustomToolbar = ({ onNavigate, label }) => {
  const handlePrevClick = () => {
    onNavigate("PREV");
  };

  const handleNextClick = () => {
    onNavigate("NEXT");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <IconButton onClick={handlePrevClick}>
        <ChevronLeft />
      </IconButton>
      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
        {label}
      </Typography>
      <IconButton onClick={handleNextClick}>
        <ChevronRight />
      </IconButton>
    </Box>
  );
};
