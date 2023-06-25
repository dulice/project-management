import { useQuery } from "@apollo/client";
import { TASKS } from "../services/queries";
import { Error, Loading, Task } from "../components";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";


const Tasks = () => {
  const { data, loading, error } = useQuery(TASKS);
  if (loading) return <Loading />;
  if (error) return <Error />;
  return (
    <>
      <Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell># Task Name</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  Task Assign Name
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  Working On Project
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading &&
                !error &&
                data.tasks.map((task) => <Task task={task} key={task.id} />)}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default Tasks;
