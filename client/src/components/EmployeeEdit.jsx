import { useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { Cancel, Update } from "@mui/icons-material";
import { DELETE_IMAGE, UPDATE_USER } from "../services/mutations";
import { toast } from "react-toastify";

const EmployeeEdit = ({ openModal, setOpenModal, user }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [photo, setPhoto] = useState(user.photo);
  const [file, setFile] = useState(null);
  const [position, setPosition] = useState(user.position);

  const [updateUser] = useMutation(UPDATE_USER, {
    variables: {id: user.id, name, email, position, photo: file },
    update: (cache, { data: { updateUser }}) => {
      // Update the cache with the new user data
      cache.modify({
        id: cache.identify(updateUser),
        fields: {
          email: () => updateUser.email,
        },
      });
    }
  });

  const [deleteImage] = useMutation(DELETE_IMAGE, {variables: {publicId: user.publicId}});

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setPhoto(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name === "" || email === "" || position === "") {
      return toast.error("Please fill all the field");
    }
    if( photo !== user.photo && user.publicId) {
      deleteImage(user.publicId);
    }
    updateUser(name, email, position, file);
    setOpenModal(false);
  };

  return (
    <>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <Paper component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <DialogContentText sx={{ opacity: 0 }}>
              To subscribe to this website, please enter your email address here
            </DialogContentText>
            <Stack spacing={3}>
              <Box>
                <input
                  type="file"
                  onChange={handleChangeImage}
                  id="image"
                  accept="image/*"
                  hidden
                />
                <label htmlFor="image">
                  <Box
                    sx={{
                      borderRadius: "50%",
                        width: 150,
                        height: 150,
                        objectFit: "cover",
                    }}
                    component="img"
                    src={photo}
                    alt=""
                  />
                </label>
              </Box>
              <TextField
                label="Name"
                name="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Position"
                name="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
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

export default EmployeeEdit;
