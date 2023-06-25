import { Box, Typography, LinearProgress } from "@mui/material";
import React, { useState, useEffect } from "react";

const DoneProgress = ({ tasks }) => {
  const [completedTask, setCompletedTask] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    const completedCount = tasks.filter((task) => task.isDone).length;
    setCompletedTask(completedCount);
    setTotalTasks(tasks.length);
  }, []);
  return (
    <>
      <Box sx={{ my: 3 }}>
        <Typography variant="caption">
          Task Done: {completedTask}/{totalTasks}
        </Typography>
        <LinearProgress
          value={(completedTask / totalTasks) * 100}
          variant="determinate"
          color="warning"
        />
      </Box>
    </>
  );
};

export default DoneProgress;
