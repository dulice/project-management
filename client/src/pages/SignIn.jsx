import { useMutation } from "@apollo/client";
import { Lock } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { SINGIN_USER } from "../services/mutations";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [signInUser] = useMutation(SINGIN_USER, {
    variables: { id: employeeId, password },
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (employeeId === "" || password === "") {
      return toast.error("Please fill all the fields!");
    }
    const login = await signInUser(employeeId, password);
    if (!login.data.signInUser) {
      return toast.error("Wrong Credentails");
    } else {
      navigate("/");
      localStorage.setItem("employeeId", login.data.signInUser.id);
    }
  };
  return (
    <>
      <Container
        maxWidth="xs"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Card>
          <CardHeader
            title="SIGN IN"
            sx={{ textAlign: "center", color: "orange" }}
          />
          <Divider />
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack direction="column" spacing={2}>
                <TextField
                  name="employeeId"
                  label="EmployeeId"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  fullWidth
                />
                <TextField
                  name="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="warning"
                  startIcon={<Lock />}
                >
                  sign in
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="primary">employeeId: 64951ff419eaf0aa25256e4e</Typography>
            <Typography color="primary">password: 123456</Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default SignIn;
