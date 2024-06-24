import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AddAPhoto, ArrowBack, Edit } from '@mui/icons-material'
import { useMutation, useQuery } from "@apollo/client";
import { USERS } from "../services/queries";
import { DELETE_IMAGE, UPDATE_PROJECT } from "../services/mutations";
import { Error, Loading } from ".";
import { toast } from "react-toastify";

const statusData = [
  { id: "new", name: "Not Started" },
  { id: "inprogress", name: "In Progress" },
  { id: "completed", name: "Completed" },
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const ProjectEdit = ({project, setIsEdit}) => {
  const previousMembersId = project.members.map(member => member.id);
  const previousStatus = statusData.find(status => status.name === project.status);

  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [languages, setLanguages] = useState(project.languages);
  const [languageInput, setLanguageInput] = useState("");
  const [image, setImage] = useState(project.image);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(previousStatus.id);
  const [membersId, setMembersId] = useState(previousMembersId);

  const { data: users, loading, error } = useQuery(USERS);
  const [deleteImage] = useMutation(DELETE_IMAGE);
  const [updateProject] = useMutation(UPDATE_PROJECT, {
    variables: { id: project.id, title, description, languages, status, membersId, image: file ?? image },
    update(cache, {data: { updateProject }}) {
        cache.modify({
          id: cache.identify(updateProject),
          fields: {
            title: () => updateProject.title
          }
        })
    }
  })

  const handleDeleteLanguage = (languageToDelete) => {
    setLanguages((languages) =>
      languages.filter((language) => language !== languageToDelete)
    );
  };

  const handleInputKeyDown = (event) => {
    if (event.key === " ") {
      event.preventDefault();
      addChip();
    }
  };

  const addChip = () => {
    const newLanguage = languageInput.trim();
    if (newLanguage !== "" && !languages.includes(newLanguage)) {
      setLanguages([...languages, newLanguage]);
      setLanguageInput("");
    }
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setImage(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(title === "" || description === "" || !image || languages.length === 0 || membersId.length === 0) {
      return toast.error("Please fill all the fields");
    }

    if(project.image !== image && project.publicId) {
      deleteImage({variables: {publicId: project.publicId}});
    }
    updateProject(title, description, languages, status, membersId, file);
    setIsEdit(false);
  }

  if (loading) return <Loading />;
  if (error) return <Error />;
  return (
    <>
      <Box>
        <IconButton onClick={() => setIsEdit(false)}>
          <ArrowBack />
        </IconButton>
        <Paper
          component="form"
          sx={{ m: 1, display: "flex", flexDirection: "column", gap: 3, p: 3 }}
          onSubmit={handleSubmit}
        >
          <Box>
            <input
              type="file"
              onChange={handleChangeImage}
              id="image"
              accept="image/*"
              hidden
            />
            <label htmlFor="image">
              {image ? (
                <Box sx={{width: "100%", height: "50vh", objectFit: "contain"}} component="img" src={image} alt="" />
              ) : (
                <Typography
                  variant="h6"
                  sx={{
                    border: "2px dashed gray",
                    height: 100,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <AddAPhoto sx={{m: 1}} />Drag 'n' drop some files here, or click to select files
                </Typography>
              )}
            </label>
          </Box>
          <TextField
            name="title"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <FormControl>
            <InputLabel>Members</InputLabel>
            <Select
              value={membersId}
              onChange={(e) => setMembersId(e.target.value)}
              name="members"
              label="Members"
              multiple
              input={<OutlinedInput label="Members" />}
              MenuProps={MenuProps}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((userId) => {
                    const user = users.users.find((user) => user.id === userId);
                    return (
                      <Chip
                        key={user.id}
                        avatar={<Avatar src={user.photo} />}
                        label={user.name}
                      />
                    );
                  })}
                </Box>
              )}
            >
              {users.users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  <Avatar src={user.photo} sx={{ mr: 1 }} />
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
              name="status"
              MenuProps={MenuProps}
            >
              {statusData.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  {status.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Stack direction="row" spacing={1}>
            {languages.map((language) => (
              <Chip
                key={language}
                label={language}
                onDelete={() => handleDeleteLanguage(language)}
              />
            ))}
          </Stack>
          <TextField
            value={languageInput}
            onChange={(e) => setLanguageInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            label="Languages"
            name="languages"
          />
          <TextField
           name="description"
            label="Description"
            multiline
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button variant="contained" startIcon={<Edit />} type="submit">Edit Project</Button>
        </Paper>
      </Box>
    </>
  );
};

export default ProjectEdit;
