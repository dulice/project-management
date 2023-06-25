import { Edit } from "@mui/icons-material";
import { Avatar, Box, Button, TableCell, TableRow, Typography } from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import { EmployeeEdit } from ".";

const EmployeeRow = ({ user }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <TableRow hover role="checkbox" tabIndex={-1} key={user.id}>
        <TableCell sx={{whiteSpace: "nowrap"}}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar src={user.photo} alt="" />
            <Typography variant="body2">{user.name}</Typography>
          </Box>
        </TableCell>
        <TableCell sx={{whiteSpace: "nowrap"}}>{user.email}</TableCell>
        <TableCell sx={{whiteSpace: "nowrap"}}>{user.position}</TableCell>
        <TableCell sx={{whiteSpace: "nowrap"}}>
          {moment(Number(user.updatedAt)).format("MMMM DD, YYYY")}
        </TableCell>
        <TableCell sx={{whiteSpace: "nowrap"}}>
          <Button
            onClick={() => setOpenModal(true)}
            variant="outlined"
            color="warning"
          >
            <Edit />
          </Button>
        </TableCell>
      </TableRow>
      <EmployeeEdit
        openModal={openModal}
        setOpenModal={setOpenModal}
        user={user}
      />
    </>
  );
};

export default EmployeeRow;
