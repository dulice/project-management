import React, { useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { CheckCircle, CheckCircleOutline } from "@mui/icons-material";
import { useMutation } from "@apollo/client";
import { UPDATE_TASK } from "../services/mutations";

const MyTask = ({ task, index }) => {
  const [isChecked, setIsChecked] = useState(task.isDone);
  const [updateTask] = useMutation(UPDATE_TASK, {
    variables: { id: task.id, isDone: isChecked },
    update: (cache, { data: { updateTask } }) => {
      cache.modify({
        id: cache.identify(updateTask),
        fields: {
          name: () => updateTask.name,
        },
      });
    },
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    setIsChecked(!isChecked);
    console.log(isChecked);
    updateTask(isChecked);
  };

  return (
    <>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <FormControlLabel
                name="Task"
                sx={{ display: "flex", justifyContent: "space-between" }}
                control={
                  <Checkbox
                    icon={<CheckCircleOutline />}
                    checkedIcon={<CheckCircle color="warning" />}
                  />
                }
                checked={task.isDone}
                onChange={handleUpdate}
                label={task.name}
                labelPlacement="start"
                className={`${task.isDone && "done"}`}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default MyTask;
