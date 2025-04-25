import { Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { updateUserApiV1UsersUserIdPut, UserUpdate } from "../api";
import { useKeycloak } from "../hooks/useKeycloak";
import { useMe } from "../hooks/useMe";
import { useNavigate } from "react-router";
import Base from "./Base";
import { useSnackBar } from "../context/SnackbarContext";


export default function ProfileInfo() {
  const { keycloak, authenticated } = useKeycloak();
  const { user, loading } = useMe();
  if (!user || loading || !authenticated || !keycloak) {
    return <div>Loading...</div>;
  }

  const navigate = useNavigate();
  const { showSnackBar } = useSnackBar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserUpdate>();

  const onSubmit: SubmitHandler<UserUpdate> = async (updateData) => {
    try {
      const { data, error, response } = await updateUserApiV1UsersUserIdPut({
        path: { user_id: user.user_id },
        body: updateData,
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        }
      });
      if (data) {
        console.log("User updated successfully", data);
        showSnackBar("User updated successfully", "success");
      } else {
        console.error("Error updating user", error);
        showSnackBar("Error updating user", "error");
      }
    } catch (err) {
      console.error(`Unexpected error: ${err}`);
      showSnackBar("Unexpected error", "error");
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
              <Typography variant="h4">Update Profile</Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                  <TextField
                    id="txt-first-name"
                    label="First Name"
                    {...register("firstName", { required: true, value: user.firstName })}
                    helperText={errors.firstName ? "First Name is required" : ""}
                    error={errors.firstName ? true : false}
                  />
                  <TextField
                    id="txt-last-name"
                    label="Last Name"
                    {...register("lastName", { required: true, value: user.lastName })}
                    helperText={errors.lastName ? "Last Name is required" : ""}
                    error={errors.lastName ? true : false}
                  />
                  <TextField
                    id="txt-email"
                    label="Email"
                    {...register("email", { required: true, value: user.email, disabled: true })}
                    helperText={errors.email ? errors.email.message : ""}
                    error={errors.email ? true : false}
                  />
                  <TextField
                    id="txt-phone-number"
                    label="Phone Number"
                    {...register("phoneNumber", { required: true, value: user.phoneNumber })}
                    helperText={
                      errors.phoneNumber ? errors.phoneNumber.message : ""
                    }
                    error={errors.phoneNumber ? true : false}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => {
                      navigate("/profile/update-password");
                    }
                    }
                  >
                    Update Password
                  </Button>
                  <Button variant="contained" type="submit">
                    Update Profile
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