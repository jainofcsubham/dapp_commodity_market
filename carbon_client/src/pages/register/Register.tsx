import "./Register.css";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, SubmitHandler } from "react-hook-form";
import moment from "moment";
import { Tab, Tabs } from "@mui/material";
import { useContext, useState } from "react";
import { UtilityContext } from "../../context/Utility.context";
import { UtilityContextType } from "../../types/UtilityContext.type";
import { ContractDetailsType } from "../../types/ContractDetails.type";
import { Contract } from "ethers";
import { useSmartContract } from "../../custom_hooks/useSmartContract";
import { BarContext } from "../../context/Bar";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const schema = yup
  .object({
    email: yup
      .string()
      .matches(emailRegex, "Invalid email address")
      .required("Email is required"),
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

  const schemaOrganization = yup
  .object({
    email: yup
      .string()
      .matches(emailRegex, "Invalid email address")
      .required("Email is required"),
    name: yup.string().required("First name is required."),
  })
  .required();

export const Register = () => {

  const [currentTab, setCurrentTab] = useState<number>(0);

  const {showBar} = useContext(BarContext)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterIndividualCredentialsType>({
    resolver: yupResolver(schema),
  });

  const {
    register : registerOrg,
    handleSubmit : handleSubmitOrg,
    formState: { errors : errorsOrg },
  } = useForm<RegisterOrganizationCredentialsType>({
    resolver: yupResolver(schemaOrganization),
  });

  const navigate = useNavigate();
  const { connectWallet, contractDetails } =
  useContext<UtilityContextType>(UtilityContext);
  const { contract } = contractDetails;
  const { callSmartContractMethod } = useSmartContract();


  const callRegisterMethod = async (contract: Contract | null,args : RegisterIndividualCredentialsType) => {
    if (contract) {
      const {
        status,
        data = "",
        error = "",
      } = await callSmartContractMethod(contract.registerUser,true, {
       ...args,
       date_of_birth : moment(args.date_of_birth).valueOf()
      });
      if (status == "SUCCESS" && data) {
        await data.wait();
        showBar("Registration successful.","success")
        navigate("/");
      } else {
        console.log(error);
      }
    }
  }
  
  const handleRegister: SubmitHandler<RegisterIndividualCredentialsType> = async (data) => {

    if (!contractDetails.contract) {
      const { contract }: ContractDetailsType = await connectWallet();
      await callRegisterMethod(contract,data);
    } else {
      await callRegisterMethod(contract,data);
    }
  };

  const handleRegisterOrganization: SubmitHandler<RegisterOrganizationCredentialsType> = async (data) => {
    // const res = await doCall({
    //   url: "/register",
    //   method: "POST",
    //   data: {
    //     ...data,
    //     date_of_birth: moment(data.date_of_birth).format("YYYY-MM-DD"),
    //   },
    // });
    // if (res.res && res.status == "success") {
    //   nav("/login");
    // } else {
    //   alert("Something went wrong!! Please try again.");
    // }

    // Register Org
  };

  const changeTab = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const goToHome = () => {
    navigate("/");
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
              <div className="register_tabs">
                <Tabs
                  variant="fullWidth"
                  value={currentTab}
                  onChange={changeTab}
                >
                  <Tab label="Individual" id= {`register-tab-0`} />
                  <Tab label="Organization" id= {`register-tab-1`} />
                </Tabs>
              </div>

              {/* Individual form */}
              {currentTab == 0 ? (
                <>
                  {" "}
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
                          <label htmlFor="date_of_birth">DOB</label>
                          <input
                            type="date"
                            {...register("date_of_birth", {
                              valueAsDate: true,
                            })}
                          />
                          {errors.date_of_birth &&
                            errors.date_of_birth.message && (
                              <div className="register_error_msg">
                                {errors.date_of_birth.message}
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="form_row">
                       
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
                </>
              ) : (
                <></>
              )}

              {/* Organization form */}
              {currentTab == 1 ? (
                <>
                  {" "}
                  <div className="register_form_container">
                    <form onSubmit={handleSubmitOrg(handleRegisterOrganization)}>
                      <div className="form_row">
                        <div className="form-group">
                          <label htmlFor="first_name">Name</label>
                          <input {...registerOrg("name")} />
                          {errorsOrg.name && errorsOrg.name.message && (
                            <div className="register_error_msg">
                              {errorsOrg.name.message}
                            </div>
                          )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="last_name">Email</label>
                          <input {...registerOrg("email")} />
                          {errorsOrg.email && errorsOrg.email.message && (
                            <div className="register_error_msg">
                              {errorsOrg.email.message}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-group">
                        <button type="submit">Register</button>
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                <></>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};
