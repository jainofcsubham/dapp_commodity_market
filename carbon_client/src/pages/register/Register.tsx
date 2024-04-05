import "./Register.css";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../components/useAxios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, SubmitHandler } from "react-hook-form";
import moment from "moment";

interface Credentials {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: Date;
}

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const schema = yup
  .object({
    email: yup
      .string()
      .matches(emailRegex, "Invalid email address")
      .required("Email is required"),
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
    first_name: yup.string().required("First name is required."),
    last_name: yup.string().required("Last name is required."),
    gender: yup.string().required("Please choose an option."),
    date_of_birth: yup
      .date()
      .typeError("Date must be a valid date")
      .max(new Date(), "Date must be less than today.")
      .required("Date of birth is required."),
  })
  .required();

export const Register = () => {
  const { doCall } = useAxios();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Credentials>({
    resolver: yupResolver(schema),
  });

  const nav = useNavigate();

  const handleRegister: SubmitHandler<Credentials> = async (data) => {
    console.log({
      ...data,
      date_of_birth : moment(data.date_of_birth).format("YYYY-MM-DD")
    })
    const res = await doCall({
      url: "/register",
      method: "POST",
      data : {
        ...data,
        date_of_birth : moment(data.date_of_birth).format("YYYY-MM-DD")
      },
    });
    if (res.res && res.status == "success") {
      nav("/login");
    } else {
      alert("Something went wrong!! Please try again.");
    }
  };

  const handleLogin = () => {
    nav("/login");
  };

  const goToHome = () => {
    nav("/");
  };

  return (
    <>
      <div className="page_wrapper">
        <div className="register_container">
          <div className="register-form">
            <div className="register_logo" onClick={goToHome}>
              CARBONCALC
            </div>
            <div className="register_box">
              <div className="register_title">Register</div>
              <div className="register_form_container">
                <form onSubmit={handleSubmit(handleRegister)}>
                  <div className="form_row">
                    <div className="form-group">
                      <label htmlFor="first_name">First Name</label>
                      <input {...register("first_name")} />
                      {errors.first_name && errors.first_name.message && (
                        <div className="register_error_msg">
                          {errors.first_name.message}
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="last_name">Last Name</label>
                      <input {...register("last_name")} />
                      {errors.last_name && errors.last_name.message && (
                        <div className="register_error_msg">
                          {errors.last_name.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form_row">
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input {...register("email")} />
                      {errors.email && errors.email.message && (
                        <div className="register_error_msg">
                          {errors.email.message}
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input type="password" {...register("password")} />
                      {errors.password && errors.password.message && (
                        <div className="register_error_msg">
                          {errors.password.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form_row">
                    <div className="form-group">
                      <label htmlFor="date_of_birth">DOB</label>
                      <input
                        type="date"
                        {...register("date_of_birth", { valueAsDate: true })}
                      />
                      {errors.date_of_birth && errors.date_of_birth.message && (
                        <div className="register_error_msg">
                          {errors.date_of_birth.message}
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="gender">Gender</label>
                      <select {...register("gender")}>
                        <option value="">Select an option</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender && errors.gender.message && (
                        <div className="register_error_msg">
                          {errors.gender.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <button type="submit">Register</button>
                  </div>
                </form>
              </div>

              <div className="register_already_account">
                <div className="register_already_account_title">
                  Already have an account?
                </div>
                <div
                  onClick={handleLogin}
                  className="register_already_account_cta"
                >
                  Login
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
