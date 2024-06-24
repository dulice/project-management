import { useMutation } from "@apollo/client";
import {
  CheckCircle,
  CheckCircleOutline,
  DeleteForever,
  Edit,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { DELETE_TASK } from "../services/mutations";
import { TASKS } from "../services/queries";
import ConfirmationModal from "./ConfirmationModal";
import TaskUpdate from "./TaskUpdate";

const Task = ({ task }) => {
  const [confirmModal, setConfirmModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [deleteTask] = useMutation(DELETE_TASK, {
    variables: { id: task.id },
    update: (cache, { data: { deleteTask } }) => {
      const { tasks } = cache.readQuery({ query: TASKS });
      cache.writeQuery({
        query: TASKS,
        data: {
          tasks: tasks.filter((el) => el.id !== deleteTask.id),
        },
      });
    },
  });
  return (
    <>
      <TableRow>
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
        <TableCell sx={{ whiteSpace: "nowrap" }}>
          <Box
            component="span"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Avatar src={task.user.photo} alt="" />
            <Typography variant="caption" sx={{ fontWeight: "bold" }}>
              {task.user.name}
            </Typography>
          </Box>
        </TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>
          <Box
            component="span"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Avatar src={task.project.image} alt="" />
            <Typography variant="body2">{task.project.title}</Typography>
          </Box>
        </TableCell>
        <TableCell>
          <IconButton variant="outlined" onClick={() => setOpenModal(true)} color="success">
            <Edit />
          </IconButton>
          <IconButton onClick={() => setConfirmModal(true)} color="error">
            <DeleteForever />
          </IconButton>
        </TableCell>
      </TableRow>
      <ConfirmationModal
        open={confirmModal}
        handleClose={() => setConfirmModal(false)}
        handleDelete={deleteTask}
        title="task"
      />
      <TaskUpdate openModal={openModal} setOpenModal={setOpenModal} task={task}/>
    </>
  );
};

export default Task;
