import { useMutation } from "@apollo/client";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { AddTask, Cancel } from "@mui/icons-material";
import { PROJECT, TASKS } from "../services/queries";
import { MenuProps } from "../pages/ProjectAdd";
import { ADD_TASK } from "../services/mutations";
import { toast } from "react-toastify";

const TaskAdd = ({ openModal, setOpenModal, project }) => {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");

  const [addTask] = useMutation(ADD_TASK, {
    variables: { name, userId, projectId: project.id },
    update(cache, {data: { addTask }}) {
        const { tasks } = cache.readQuery({query: TASKS, variables: {name, userId}});
        cache.writeQuery({
            query: TASKS,
            data: {tasks: [addTask, ...tasks]},            
        });
        const readProject  = cache.readQuery({query: PROJECT, variables: {id: project.id}});
        cache.writeQuery({
          query: PROJECT,
          data: {
            project: {
              ...readProject.project,
              tasks: [addTask, ...readProject.project.tasks ]
            }
          }
        })
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    if(name === "" || userId === "") {
        return toast.error("Please fill all the field")
    }
    addTask(name, userId);
    setName("");
    setUserId("");
    setOpenModal(false);
  }

  return (
    <>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <Paper component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <DialogContentText sx={{ opacity: 0 }}>
              To subscribe to this website, please enter your email address here
            </DialogContentText>
            <Stack spacing={3}>
              <TextField
                label="Name"
                name="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FormControl>
                <InputLabel>Select User</InputLabel>
                <Select
                  label="Select User"
                  name="user"
                  MenuProps={MenuProps}
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                >
                  {project.members.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
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
            <Button endIcon={<Cancel />} variant="standard" onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="warning" startIcon={<AddTask />}>
              Add
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>
    </>
  );
};

export default TaskAdd;
