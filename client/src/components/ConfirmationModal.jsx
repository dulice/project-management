import { Cancel } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React from "react";

const ConfirmationModal = ({ open, handleClose, title, handleDelete }) => {
  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Are you sure you want to delete this {title}?</DialogTitle>
        <DialogContent>
          This will delete this {title} permanently. You cannot undo this
          action.
        </DialogContent>
        <DialogActions>
            <Button endIcon={<Cancel />} variant="outlined" onClick={handleClose}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmationModal;
