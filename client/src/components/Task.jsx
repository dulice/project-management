import { useMutation } from "@apollo/client";
import {
  CheckCircle,
  CheckCircleOutline,
  DeleteForever,
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
import React from "react";
import { DELETE_TASK } from "../services/mutations";
import { TASKS } from "../services/queries";

const Task = ({ task }) => {
  const [deleteTask] = useMutation(DELETE_TASK, {
    variables: { id: task.id },
    update: (cache, { data: { deleteTask } }) => {
      const { tasks } = cache.readQuery({query: TASKS});
      cache.writeQuery({
        query: TASKS,
        data: {
          tasks: tasks.filter(el => el.id !== deleteTask.id)
        }
      })
    },
  });
  return (
    <>
      <TableRow>
        <TableCell sx={{ width: "100%", whiteSpace: "nowrap" }}>
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
            <Avatar src={task.user.photo} alt="" component="span" />
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
            <Avatar src={task.project.image} alt="" component="span" />
            <Typography variant="body2">{task.project.title}</Typography>
          </Box>
        </TableCell>
        <TableCell>
          <IconButton onClick={deleteTask} color="error">
            <DeleteForever />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Task;
