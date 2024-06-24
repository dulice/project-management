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
  const { id, name, isDone} = task;
  const [isChecked, setIsChecked] = useState(isDone);
  const [updateTask] = useMutation(UPDATE_TASK, {
    variables: { id, name, isDone: !isChecked },
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
    updateTask();
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
                checked={isChecked}
                onChange={handleUpdate}
                label={name}
                labelPlacement="start"
                className={`${isChecked && "done"}`}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default MyTask;
