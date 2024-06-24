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

const columns = [
  "# Task Name",
  "Task Assign Name",
  "Working On Project",
  "Action",
];

const Tasks = () => {
  const { data, loading, error } = useQuery(TASKS);
  if (loading) return <Loading />;
  if (error) return <Error />;
  return (
    <>
      <Box>
        <TableContainer sx={{ maxHeight: 490 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}
                  >
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.tasks.map((task) => (
                <Task task={task} key={task.id} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default Tasks;
