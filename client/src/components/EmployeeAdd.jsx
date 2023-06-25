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
import { Cancel, PersonAdd } from "@mui/icons-material";
import { USERS } from "../services/queries";
import { ADD_USER } from "../services/mutations";
import { toast } from "react-toastify";

const defaultProfile = "https://res.cloudinary.com/grace26/image/upload/v1664693577/2e4566fd829bcf9eb11ccdb5f252b02f_tye4l7.jpg";

const EmployeeAdd = ({ openModal, setOpenModal }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [photo, setPhoto] = useState(defaultProfile);
    const [file, setFile] = useState(null);
    const [position, setPosition] = useState("");

  const [addUser] = useMutation(ADD_USER, {
    variables: {name, email, photo: file, password, position},
    update: (cache, {data: {addUser}}) => {
        const { users } = cache.readQuery({query: USERS});
        cache.writeQuery({
            query: USERS,
            data: {users: [addUser, ...users]}
        })
    }
  })

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setFile(file)
    setPhoto(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(name === "" || email === "" || position === "" || password=== "") {
        return toast.error("Please fill all the field")
    }
    addUser(name, email, file, position, password);
    setName("");
    setEmail("");
    setPosition("");
    setPassword("");
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
                name="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Position"
                name="Position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
              <TextField
                label="Login Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

            </Stack>
          </DialogContent>
          <DialogActions>
            <Button endIcon={<Cancel />} variant="standard" onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="warning" startIcon={<PersonAdd />}>
              Add
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>
    </>
  );
};

export default EmployeeAdd;
