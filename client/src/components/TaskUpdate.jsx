import { useMutation, useQuery } from "@apollo/client";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Cancel, Update } from "@mui/icons-material";
import { GET_PROJECTS } from "../services/queries";
import { MenuProps } from "../pages/ProjectAdd";
import { UPDATE_TASK } from "../services/mutations";
import { toast } from "react-toastify";

const TaskUpdate = ({ openModal, setOpenModal, task }) => {
  const [name, setName] = useState(task.name);
  const [userId, setUserId] = useState(task.user.id);
  const [projectId, setProjectId] = useState(task.project.id);
  const { data, loading, error } = useQuery(GET_PROJECTS);
  const [updateTask] = useMutation(UPDATE_TASK, {
    variables: { id: task.id, name, userId, projectId },
    update(cache, { data: { updateTask } }) {
      cache.modify({
        id: cache.identify(updateTask),
        fields: {
          title: () => updateTask.name,
        },
      });
    },
  });

  useEffect(() => {
    setName(task.name);
    setUserId(task.user.id);
    setProjectId(task.project.id);
  }, [openModal]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name === "" || userId === "") {
      return toast.error("Please fill all the field");
    }
    updateTask();
    setName("");
    setUserId("");
    setOpenModal(false);
  };

  return (
    <>
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <Paper component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={3}>
              <TextField
                label="Name"
                name="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FormControl>
                <InputLabel>Select Project</InputLabel>
                <Select
                  label="Select Project"
                  name="project"
                  MenuProps={MenuProps}
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                >
                  {!loading &&
                    !error &&
                    data.projects.map((project) => (
                      <MenuItem key={project.id} value={project.id}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Avatar src={project.image} alt="" />
                          <Typography variant="body2">
                            {project.title}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel>Select User</InputLabel>
                <Select
                  label="Select User"
                  name="user"
                  MenuProps={MenuProps}
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                >
                  {projectId &&
                    data?.projects
                      .find((project) => project.id === projectId)
                      .members.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Avatar src={user.photo} alt="" />
                            <Typography variant="body2">{user.name}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              endIcon={<Cancel />}
              variant="standard"
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="warning"
              startIcon={<Update />}
            >
              Update
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>
    </>
  );
};

export default TaskUpdate;
