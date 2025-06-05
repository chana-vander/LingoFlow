// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { RegisterForm } from "../models/user";

// const Register = () => {
//     const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();
//     const navigate = useNavigate();
//     const [errorMessage, setErrorMessage] = useState("");
//     const [successMessage, setSuccessMessage] = useState(""); // הודעת הצלחה

//     const onSubmit = async (data: RegisterForm) => {
//         try {
//             const response = await fetch("http://localhost:5092/api/auth/register", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(data),
//             });

//             if (!response.ok) {
//                 throw new Error("הרשמה נכשלה. בדוק את הפרטים ונסה שוב.");
//             }

//             const result = await response.json();
//             localStorage.setItem("user", JSON.stringify(result)); // שמירת המשתמש בלוקלסטורג

//             setSuccessMessage("נרשמת בהצלחה! ברוך הבא ל-LingoFlow!"); // הצגת הודעת הצלחה
//             setTimeout(() => {
//                 navigate("/"); // ניתוב לעמוד הבית לאחר ההרשמה
//             }, 4000); // אחרי 4 שניות ינותב לעמוד הבית

//         } catch (error: unknown) { // טיפוס ל-unknown
//             if (error instanceof Error) {
//                 setErrorMessage(error.message); // ניגש ל-message של השגיאה
//             } else {
//                 setErrorMessage("שגיאה לא ידועה");
//             }
//         }
//     };

//     return (
//         <div style={{ maxWidth: "300px", margin: "auto", textAlign: "center" }}>
//             <h2>הרשמה</h2>
//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <input {...register("name", { required: "יש להזין שם" })} placeholder="שם מלא" />
//                 {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}

//                 <input {...register("email", { required: "יש להזין אימייל" })} placeholder="אימייל" type="email" />
//                 {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}

//                 <input {...register("password", { required: "יש להזין סיסמה", minLength: { value: 6, message: "סיסמה חייבת להיות לפחות 6 תווים" } })} placeholder="סיסמה" type="password" />
//                 {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
//                 <br />
//                 <button type="submit">הירשם</button>
//             </form>

//             {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
//             {successMessage && <p style={{ color: "green" }}>{successMessage}</p>} {/* הצגת הודעת הצלחה */}
//         </div>
//     );
// };

// export default Register;

//MUI:
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import { styled } from "@mui/system";
import { RegisterForm } from "../models/user";
import userStore from "../stores/userStore";
import config from "../config";

// העיצוב המורכב
const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  backgroundColor: "#fff", // הצבע שברצונך להשתמש בו כעת לבן
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
  backgroundColor: "#fff", // צבע רקע לבן
  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)", // צל מותאם אישית יותר עדין
  transition: "box-shadow 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0px 12px 40px rgba(0, 0, 0, 0.2)", // צל חזק יותר בהובר
  },
}));

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { apiUrl } = config;
  console.log(apiUrl);
  const onSubmit = async (data: RegisterForm) => {
    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("הרשמה נכשלה. בדוק את הפרטים ונסה שוב.");
      }

      const result = await response.json();
      //changed
      // localStorage.setItem("user", JSON.stringify(result));
      // localStorage.setItem("userId",JSON.stringify(result.user.id));
      userStore.setUser(result.user);
      setSuccessMessage("נרשמת בהצלחה! ברוך הבא ל-LingoFlow!");
      setTimeout(() => {
        navigate("/");
      }, 4000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("שגיאה לא ידועה");
      }
    }
  };

  return (
    <StyledContainer>
      <FormWrapper>
        <Typography variant="h4" gutterBottom>
          הרשמה
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <TextField
            {...register("name", { required: "יש להזין שם" })}
            label="שם מלא"
            variant="outlined"
            fullWidth
            margin="normal"
            helperText={errors.name ? errors.name.message : ""}
            error={!!errors.name}
          />
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
            {...register("password", {
              required: "יש להזין סיסמה",
              minLength: {
                value: 6,
                message: "סיסמה חייבת להיות לפחות 6 תווים",
              },
            })}
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
            הירשם
          </Button>
        </form>
        {errorMessage && (
          <Typography color="error" style={{ marginTop: "15px" }}>
            {errorMessage}
          </Typography>
        )}
        {successMessage && (
          <Typography color="success" style={{ marginTop: "15px" }}>
            {successMessage}
          </Typography>
        )}
      </FormWrapper>
    </StyledContainer>
  );
};

export default Register;

//2
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import { Container } from '@mui/material';
// import { styled } from '@mui/system';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';

// // סכמת ולידציה עם Yup
// const schema = yup.object().shape({
//     name: yup.string().required("שם מלא הוא שדה חובה"),
//     email: yup.string().email("כתובת המייל לא תקינה").required("מייל הוא שדה חובה"),
//     password: yup.string()
//         .min(8, "הסיסמה חייבת להכיל לפחות 8 תווים")
//         .matches(/[A-Z]/, "הסיסמה חייבת לכלול לפחות אות גדולה אחת")
//         .matches(/[0-9]/, "הסיסמה חייבת לכלול לפחות מספר אחד")
//         .required("סיסמה היא שדה חובה"),
// });

// // Styled components
// const StyledContainer = styled(Container)(({ theme }) => ({
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: '100vh',
//     backgroundColor: '#f5f5f5', // רקע בהיר
//     padding: theme?.spacing(2) || '16px',
// }));

// const FormWrapper = styled(Box)(({ theme }) => ({
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '100%',
//     maxWidth: 450,
//     padding: theme?.spacing(4) || '32px',
//     borderRadius: '12px',
//     backgroundColor: '#fff',
//     boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.15)',
//     transition: 'box-shadow 0.3s ease-in-out',
//     '&:hover': {
//         boxShadow: '0px 12px 40px rgba(0, 0, 0, 0.2)',
//     },
// }));

// const SignIn = () => {

//     const navigate = useNavigate();
//     const [msg, setMsg] = useState<string>("");
//     const { register, handleSubmit, formState: { errors } } = useForm({
//         resolver: yupResolver(schema),
//         mode: "onSubmit",
//     });

//     const onSubmit = async (data: any) => {
//         try {
//             const response = await fetch("http://localhost:5092/api/auth/register", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(data),
//             });

//             if (!response.ok) {
//                 throw new Error("הרשמה נכשלה. בדוק את הפרטים ונסה שוב.");
//             }

//             const result = await response.json();
//             localStorage.setItem("user", JSON.stringify(result));
//             setMsg("נרשמת בהצלחה! ברוך הבא ל-LingoFlow!");
//             setTimeout(() => {
//                 navigate("/");
//             }, 4000);

//         } catch (error: any) {
//             setMsg("שגיאה בחיבור לשרת. נסה שוב מאוחר יותר.");
//         }
//     };

//     return (
//         <StyledContainer>
//             <FormWrapper>
//                 <Typography variant="h4" gutterBottom color="#d81b60" textAlign="center">
//                     הרשמה למערכת
//                 </Typography>

//                 {msg && (
//                     <Typography variant="body1" color={msg.includes("בהצלחה") ? "success" : "error"} textAlign="center" gutterBottom>
//                         {msg}
//                     </Typography>
//                 )}

//                 <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
//                     <TextField
//                         fullWidth
//                         label="שם מלא"
//                         variant="outlined"
//                         {...register("name")}
//                         error={!!errors.name}
//                         helperText={errors.name ? errors.name.message : ''}
//                         sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& input': { textAlign: 'right' }, '& fieldset': { borderColor: "#d81b60" } } }}
//                     />
//                     <TextField
//                         fullWidth
//                         label="כתובת מייל"
//                         type="email"
//                         variant="outlined"
//                         {...register("email")}
//                         error={!!errors.email}
//                         helperText={errors.email ? errors.email.message : ''}
//                         sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& input': { textAlign: 'right' }, '& fieldset': { borderColor: "#d81b60" } } }}
//                     />
//                     <TextField
//                         fullWidth
//                         label="סיסמה"
//                         type="password"
//                         variant="outlined"
//                         {...register("password")}
//                         error={!!errors.password}
//                         helperText={errors.password ? errors.password.message : ''}
//                         sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& input': { textAlign: 'right' }, '& fieldset': { borderColor: "#d81b60" } } }}
//                     />

//                     <Button
//                         type="submit"
//                         variant="contained"
//                         color="primary"
//                         fullWidth
//                         sx={{ mt: 2, bgcolor: "#d81b60", '&:hover': { bgcolor: "#c2185b" } }}>
//                         להירשם עכשיו
//                     </Button>
//                 </form>
//             </FormWrapper>
//         </StyledContainer>
//     );
// };

// export default SignIn;
