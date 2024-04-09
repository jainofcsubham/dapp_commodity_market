import "./Login.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../custom_hooks/useAxios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CredentialsType } from "../../types/Credentials.type";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const schema = yup
  .object({
    username: yup
      .string()
      .matches(emailRegex, "Invalid username.")
      .required("Username is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one digit")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
  })
  .required();

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CredentialsType>({
    resolver: yupResolver(schema),
  });

  const { doCall } = useAxios();
  const nav = useNavigate();

  const handleLogin: SubmitHandler<CredentialsType> = async (data) => {
    const res = await doCall({
      url: "/login",
      method: "POST",
      data: {
        password: data.password,
        email: data.username,
      },
    });
    if (res.res && res.res.status == "success") {
      const idToken:any = res.res && res.res.idToken ? res.res.idToken : ''
      localStorage.setItem('idToken',idToken)
      nav("/dashboard/calculator");
    } else {
      alert("Something went wrong!! Please try again.");
    }
  };

  const handleRegisterNow = () => {
    nav("/register");
  };

  const handleForgotPass = () => {
    nav("/forgot-password");
  };

  const goToHome = () => {
    nav("/");
  };

  const a = import.meta.env.VITE_TEMP

  return (
    <>
    {a}
      <div className="page_wrapper">
        <div className="login_container">
          <div className="login-form">
            <div className="login_logo" onClick={goToHome}>
              CARBONCALC
            </div>
            <div className="login_box">
              <div className="login_title">Login</div>
              <div className="login_register_title">
                <div className="login_no_account">
                  Don't have an account yet?
                </div>
                <div onClick={handleRegisterNow} className="login_register_cta">
                  Register Now
                </div>
              </div>

              <form onSubmit={handleSubmit(handleLogin)}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input {...register("username")} />
                  {errors.username && errors.username.message && (
                    <div className="login_error_msg">
                      {errors.username.message}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input type="password" {...register("password")} />
                  {errors.password && errors.password.message && (
                    <div className="login_error_msg">
                      {errors.password.message}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <button type="submit">Login</button>
                </div>
              </form>

              <div className="login_forgot_pass_container">
                <div onClick={handleForgotPass} className="login_forgot_pass">
                  Forgot your password?
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
