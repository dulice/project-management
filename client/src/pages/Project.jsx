import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { GET_PROJECTS, PROJECT } from "../services/queries";
import {
  DoneProgress,
  Error,
  Loading,
  ProjectEdit,
  TaskAdd,
} from "../components";
import {
  Typography,
  Box,
  CardActions,
  AvatarGroup,
  Avatar,
  Button,
  Chip,
  Grid,
  Table,
  TableBody,
  TableRow,
  FormControlLabel,
  Checkbox,
  TableContainer,
  TableCell,
  TableHead,
  Stack,
  IconButton,
  Container,
  Fab,
} from "@mui/material";
import { green } from "@mui/material/colors";
import { getRandomNumber } from "../components/ProjectCard";
import { useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle,
  CheckCircleOutline,
  Add,
  Edit,
  Delete,
  ArrowBack,
} from "@mui/icons-material";
import { DELETE_IMAGE, DELETE_PROJECT } from "../services/mutations";
import ConfirmationModal from "../components/ConfirmationModal";

const Project = () => {
  const [openModal, setOpenModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleteProject] = useMutation(DELETE_PROJECT);
  const [deleteImage] = useMutation(DELETE_IMAGE);
  const { data, loading, error } = useQuery(PROJECT, { variables: { id } });
  const handleDeleteProject = () => {
    deleteProject({
      variables: { id },
      update: (cache, { data: { deleteProject } }) => {
        const { projects } = cache.readQuery({ query: GET_PROJECTS });
        cache.writeQuery({
          query: GET_PROJECTS,
          data: {
            projects: projects.filter(
              (project) => project.id !== deleteProject.id
            ),
          },
        });
      },
    });
    if (data.project?.publicId) {
      deleteImage({
        variables: { publicId: data.project.publicId },
      });
    }
    navigate("/projects");
  };
  if (loading) return <Loading />;
  if (error) return <Error />;
  return (
    <>
      {isEdit ? (
        <ProjectEdit project={data.project} setIsEdit={setIsEdit} />
      ) : (
        <Container>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
            <Stack spacing={1} direction="row">
              <Fab onClick={() => setIsEdit(true)} color="success" size="small">
                <Edit />
              </Fab>
              <Fab
                onClick={() => setConfirmModal(true)}
                size="small"
                color="error"
              >
                <Delete />
              </Fab>
              <Fab onClick={() => setOpenModal(true)} color="warning" size="small">
                <Add />
              </Fab>
            </Stack>
          </Box>
          <TaskAdd
            openModal={openModal}
            setOpenModal={setOpenModal}
            project={data.project}
          />
          <ConfirmationModal
            open={confirmModal}
            handleClose={() => setConfirmModal(false)}
            handleDelete={() => handleDeleteProject()}
            title="project"
          />
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar src={data.project.image} />
                <Typography variant="h5">{data.project.title}</Typography>
              </Box>
              <Chip
                label={data.project.status}
                sx={{ mb: 3, mt: 1, color: green[500] }}
              />
              <DoneProgress tasks={data.project.tasks} />
              <Typography paragraph>{data.project.description}</Typography>

              <Box>
                {data.project.languages.map((language, index) => (
                  <Typography
                    key={index}
                    variant="caption"
                    sx={{
                      fontWeight: "bold",
                      mr: 1,
                      color: `#${getRandomNumber()}`,
                    }}
                  >
                    #{language}
                  </Typography>
                ))}
              </Box>
              <CardActions>
                <AvatarGroup max={6}>
                  {data.project.members.map((member) => (
                    <Avatar key={member.id} src={member.photo} />
                  ))}
                </AvatarGroup>
              </CardActions>
            </Grid>
            <Grid item xs={12} md={5}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell># Task Name</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        Task Assign Name
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.project.tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          <FormControlLabel
                            checked={task.isDone}
                            control={
                              <Checkbox
                                icon={<CheckCircleOutline />}
                                checkedIcon={<CheckCircle color="warning" />}
                              />
                            }
                            label={task.name}
                            className={`${task.isDone && "done"}`}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ whiteSpace: "nowrap", textAlign: "left" }}
                        >
                          <Box
                            component="span"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Avatar
                              src={task.user.photo}
                              alt=""
                              component="span"
                            />
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: "bold" }}
                            >
                              {task.user.name}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
};

export default Project;
