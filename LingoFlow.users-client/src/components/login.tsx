//login.tsx to lingoflow
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoginForm } from "../models/user";
import userStore from "../stores/userStore";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import { styled } from "@mui/system";
import config from "../config";
// העיצוב
const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  backgroundColor: "#fff",
  padding: theme?.spacing(2) || "16px",
}));

const FormWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  maxWidth: 450,
  padding: theme?.spacing(4) || "32px",
  borderRadius: "12px",
  backgroundColor: "#fff",
  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
  transition: "box-shadow 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0px 12px 40px rgba(0, 0, 0, 0.2)",
  },
}));

const Login = () => {
  const apiurl=config.apiUrl;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await fetch(`${apiurl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log(response.json);
      if (!response.ok) {
        throw new Error("התחברות נכשלה. בדוק את הפרטים ונסה שוב.");
      }

      const result = await response.json();
      //changed
      // localStorage.setItem("user", JSON.stringify(result));
      // localStorage.setItem("userId",JSON.stringify(result.user.id));
      console.log(result.user);
      console.log(result.data);

      userStore.setUser(result.user);
      navigate("/");
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "שגיאה לא ידועה"
      );
    }
  };

  return (
    <StyledContainer>
      <FormWrapper>
        <Typography variant="h4" gutterBottom>
        התחבר והמשך לתרגל, ללמוד ולהשתפר
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <TextField
            {...register("email", { required: "יש להזין אימייל" })}
            label="אימייל"
            variant="outlined"
            fullWidth
            margin="normal"
            helperText={errors.email ? errors.email.message : ""}
            error={!!errors.email}
          />
          <TextField
            {...register("password", { required: "יש להזין סיסמה" })}
            label="סיסמה"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            helperText={errors.password ? errors.password.message : ""}
            error={!!errors.password}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            style={{ marginTop: "20px", padding: "12px" }}
          >
            התחבר
          </Button>
        </form>

        {errorMessage && (
          <Typography color="error" style={{ marginTop: "15px" }}>
            {errorMessage}
          </Typography>
        )}
      </FormWrapper>
    </StyledContainer>
  );
};

export default Login;
