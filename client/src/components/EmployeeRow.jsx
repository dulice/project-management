import { Delete, Edit } from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import { EmployeeEdit } from ".";
import ConfirmationModal from "./ConfirmationModal";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_IMAGE, DELETE_USER, UPDATE_PROJECT } from "../services/mutations";
import { USERS } from "../services/queries";

const EmployeeRow = ({ user }) => {
  const [openModal, setOpenModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [deleteUser] = useMutation(DELETE_USER);
  const [deleteImage] = useMutation(DELETE_IMAGE);
  
  const handleDelete = () => {
    deleteUser({
      variables: { id: user.id},
      update: (cache, {data: { deleteUser }}) => {
        const { users } = cache.readQuery({query: USERS});
        cache.writeQuery({
          query: USERS,
          data: {
            users: users.filter(employee => employee.id !== deleteUser.id)
          }
        })
      }
    });
    if(user.publicId) {
      deleteImage({
        variables: {publicId: user.publicId},
      })
    }
  }
  
  return (
    <>
      <TableRow hover role="checkbox" tabIndex={-1} key={user.id}>
        <TableCell sx={{ whiteSpace: "nowrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar src={user.photo} alt="" />
            <Typography variant="body2">{user.name}</Typography>
          </Box>
        </TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>{user.email}</TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>{user.position}</TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>
          {moment(Number(user.updatedAt)).format("MMMM DD, YYYY")}
        </TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>
          <IconButton
            onClick={() => setOpenModal(true)}
            variant="outlined"
            color="warning"
          >
            <Edit />
          </IconButton>
          <IconButton onClick={() => setConfirmModal(true)} color="error">
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>
      <EmployeeEdit
        openModal={openModal}
        setOpenModal={setOpenModal}
        user={user}
      />
      <ConfirmationModal
        open={confirmModal}
        handleClose={() => setConfirmModal(false)}
        handleDelete={handleDelete}
        title="employee information"
      />
    </>
  );
};

export default EmployeeRow;
