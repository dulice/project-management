import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { USERS } from "../services/queries";
import { EmployeeAdd, EmployeeRow, Error, Loading } from "../components";
import {
  Avatar,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";

const columns = ["Username", "Email", "Position", "Join At", "Action"];

export default function Employee() {
  const { data, loading, error } = useQuery(USERS);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (loading) return <Loading />;
  if (error) return <Error />;
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={{ float: "right" }}>
        <Button
          onClick={() => setOpenModal(true)}
          variant="contained"
          color="warning"
          sx={{ borderRadius: "50%", minWidth: "20px", padding: 1 }}
        >
          <Add />
        </Button>
        <EmployeeAdd openModal={openModal} setOpenModal={setOpenModal}/>
      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => <EmployeeRow user={user} key={user.id} />)}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={data.users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
