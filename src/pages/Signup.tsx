import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { MouseEvent, useState } from "react";
import {
  createUserApiV1UsersPost,
  ModulesUserUserSchemaUserCreate,
} from "../api";
import { useKeycloak } from "../hooks/useKeycloak";
import { useForm, SubmitHandler, Path, UseFormRegister } from "react-hook-form";

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  name: Path<ModulesUserUserSchemaUserCreate>;
  register?: UseFormRegister<ModulesUserUserSchemaUserCreate>;
  required: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
};

const PasswordField = ({
  id,
  label,
  value,
  name,
  required,
  onChange,
  error,
  register,
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <FormControl>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput
        id={id}
        label={label}
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        value={value}
        required={required}
        error={error}
        {...(register && register(name, { required, onChange }))}
        onChange={onChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={showPassword ? "hidePassword" : "showPassword"}
              aria-controls="password"
              onClick={() => setShowPassword((show) => !show)}
              onMouseDown={handleMouseDownPassword}
              onMouseUp={handleMouseUpPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
      <FormHelperText error={error}>
        {error ? "Passwords do not match" : ""}
      </FormHelperText>
    </FormControl>
  );
};

export default function Signup() {
  const { keycloak, authenticated } = useKeycloak();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function validatePassword() {
    return password === confirmPassword;
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ModulesUserUserSchemaUserCreate>();

  const onSubmit: SubmitHandler<ModulesUserUserSchemaUserCreate> = async (
    data
  ) => {
    console.log(data);
    const { data: response, error } = await createUserApiV1UsersPost({
      body: data,
    });
    console.log(response, error);

    if (response) {
      keycloak?.login({
        redirectUri: window.location.origin + "/",
      });
    }
  };

  return (
    <Box
      sx={{ justifyContent: "center", alignItems: "center", height: "100vh" }}
    >
      <Card sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
        <CardContent>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4">Sign Up</Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              component="p"
              sx={{ mt: 1, textAlign: "center" }}
            >
              Provide details for your new account
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <TextField
                  id="txt-first-name"
                  label="First Name"
                  {...register("firstName", { required: true })}
                  helperText={errors.firstName ? "First Name is required" : ""}
                  error={errors.firstName ? true : false}
                />
                <TextField
                  id="txt-last-name"
                  label="Last Name"
                  {...register("lastName", { required: true })}
                  helperText={errors.lastName ? "Last Name is required" : ""}
                  error={errors.lastName ? true : false}
                />
                <TextField
                  id="txt-email"
                  label="Email"
                  {...register("email", { required: true })}
                  helperText={errors.email ? "Email is required" : ""}
                  error={errors.email ? true : false}
                />
                <TextField
                  id="txt-phone-number"
                  label="Phone Number"
                  {...register("phoneNumber", { required: true })}
                  helperText={errors.phoneNumber ? "Phone Number is required" : ""}
                  error={errors.phoneNumber ? true : false}
                />
                <PasswordField
                  id="txt-password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={false}
                  register={register}
                  required
                  name="password"
                />
                <PasswordField
                  id="txt-confirm-password"
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!validatePassword()}
                  name="password"
                  required
                />
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    By clicking Sign Up, you agree to our Terms, Data Policy and
                    Cookies Policy.
                  </Typography>
                </Box>
                <Button variant="contained" type="submit">
                  Sign up
                </Button>
              </Stack>
            </form>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
