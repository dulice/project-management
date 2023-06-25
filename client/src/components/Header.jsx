import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
} from "@mui/material";
import { Notifications, Search } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { USER } from "../services/queries";

const Header = () => {
  const employeeId = localStorage.getItem("employeeId");
  const [anchorEl, setAnchorEl] = useState(null);
  const { pathname } = useLocation();
  const {data, loading, error} = useQuery(USER, {variables: {id: employeeId}})

  const hideRoutes = ['/signin'];
  const open = Boolean(anchorEl);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  if(hideRoutes.includes(pathname)) return null;
  return (
    <AppBar
      position="sticky"
      sx={{ mb: 3, bgcolor: "whitesmoke", boxShadow: "none" }}
    >
      <Toolbar>
        <Paper
          component="form"
          sx={{ display: "flex", alignItems: "center", width: "90%" }}
        >
          <IconButton>
            <Search />
          </IconButton>
          <InputBase
            placeholder="Search..."
            sx={{ p: "10px", width: "100%" }}
          />
        </Paper>
        <IconButton>
          <Notifications />
        </IconButton>
        <IconButton onClick={handleClick}>
          {!loading && !error && <Avatar src={data.user.photo} />}
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose} >
          <MenuItem>
            <Link to="/signin" onClick={handleClose}>
              Logout
            </Link>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
