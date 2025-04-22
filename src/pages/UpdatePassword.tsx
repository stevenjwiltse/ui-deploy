import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { useKeycloak } from "../hooks/useKeycloak";
import Base from "./Base";
import PasswordField from "../components/PasswordField";
import { SubmitHandler, useForm } from "react-hook-form";
import { updateUserPassword, UserPasswordUpdate } from "../api";
import { useMe } from "../hooks/useMe";
import { useSnackBar } from "../context/SnackBarContext";
import { useNavigate } from "react-router";

export default function UpdatePassword() {
  const { keycloak, authenticated } = useKeycloak();
  const { user, loading } = useMe();
  if (!user || loading || !authenticated || !keycloak) {
    return <div>Loading...</div>;
  }

  const { showSnackBar } = useSnackBar();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function validatePassword() {
    return password === confirmPassword;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserPasswordUpdate>();

  const onSubmit: SubmitHandler<UserPasswordUpdate> = async (createData) => {
    if (!validatePassword()) {
      return;
    }
    try {
      const { data, error, response } = await updateUserPassword({
        body: createData,
        headers: {
          Authorization: `Bearer ${keycloak?.token}`,
        },
        path: {
          user_id: user.user_id,
        }
      });
      if (error) {
        if (error.detail) {
          if (error.detail === "Old password is incorrect") {
            showSnackBar("Old password is incorrect", "error");
          } else {
            showSnackBar("Error updating password", "error");
          }
        } else {
          showSnackBar("Error updating password", "error");
        }
        return;
      }
      if (data) {
        showSnackBar("Password updated successfully", "success");
        navigate("/profile");
      }
    } catch (err) {
      showSnackBar("Error updating password", "error");
    }
  };

  return (
    <Base>
      <Box
        sx={{ justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <Card sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
          <CardContent>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4">Update Password</Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                  <PasswordField
                    id="txt-old-password"
                    label="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    error={false}
                    register={register}
                    required
                    name="old_password"
                  />
                  <PasswordField
                    id="txt-password"
                    label="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={false}
                    register={register}
                    required
                    name="new_password"
                  />
                  <PasswordField
                    id="txt-confirm-password"
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={!validatePassword()}
                    register={register}
                    name="confirm_password"
                    required
                  />
                  <Button variant="contained" type="submit">
                    Update Password
                  </Button>
                </Stack>
              </form>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Base>
  )
}