import React, { useEffect, useState } from "react";
import "./Calculator.css";
import moment from "moment";
import { useAxios } from "../../components/useAxios";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  useForm,
} from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import { FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface IOption {
  label: string;
  value: number;
  factor: number;
}

interface Question {
  question: string;
  id: string;
  answer: number | Date | null;
  type: "number" | "radio" | "date";
  options?: Array<IOption>;
  factor: number;
}

interface Category {
  category: string;
  questions: Array<Question>;
  id: string;
}

interface ICalculatorProps {
  askToSave?: boolean;
}

const stepOneCategory: Category = {
  category: "Estimation Period",
  id: "category_1",
  questions: [
    {
      question: "Please choose start date of Estimation period",
      type: "date",
      factor: 0,
      answer: null,
      id: "start_date",
    },
    {
      question: "Please choose end date of Estimation period",
      type: "date",
      factor: 0,
      answer: null,
      id: "end_date",
    },
  ],
};

export const Calculator = ({ askToSave = false }: ICalculatorProps) => {
  const [questionsFromAPI, setQuestionsFromAPI] = useState<Array<Category>>([]);
  const [questions, setQuestions] = useState<Array<Category>>([]);

  const navigate = useNavigate()
  const { doCall } = useAxios();

  const getDefaultAnswer = (type: string) => {
    switch (type) {
      case "number":
      case "input":
        return 0;
      case "string":
      case "text":
        return "";
      case "date":
        return null;
      default:
        return 0;
    }
  };

  const getQuestions = async () => {
    const res = await doCall({
      url: "/questions",
    });
    let dbQuestions: Array<Category> =
      res && res.res && res.res.data
        ? res.res.data.map((each: any) => {
            return {
              category: each?.category_name,
              id: each?.category_id,
              questions: each.questions
                ? each.questions.map((question: any) => {
                    return {
                      question: question.question,
                      id: question.question_id,
                      answer: getDefaultAnswer(question.answer_type),
                      type:
                        question.options && question.options.length
                          ? "radio"
                          : "number",
                      options:
                        question.options && question.options.length
                          ? question.options.map((option: any) => {
                              return {
                                label: option.value,
                                value: option.value,
                                factor: option.factor,
                              };
                            })
                          : [],
                      factor: question.factor,
                    };
                  })
                : [],
            };
          })
        : [];

    setQuestions([stepOneCategory, ...dbQuestions]);
    setQuestionsFromAPI([stepOneCategory, ...dbQuestions]);
  };

  useEffect(() => {
    getQuestions();
  }, []);

  const [finalAnswer, setFinalAnswer] = useState<{
    isCalculationDone: boolean;
    answer: number;
  }>({
    isCalculationDone: false,
    answer: 0,
  });

  const [currentCategoryDetails, setCurrentCategoryDetails] =
    useState<number>(0);

  const onSubmit = (data: any) => {
    let ans = 0;
    questions.forEach((category) => {
      category.questions.forEach((each) => {
        let type = each.options && each.options.length ? "radio" : each.type;
        if (type == "number") {
          ans = ans + Number(data[each.id]) * each.factor;
        } else if (type == "radio" && category.category == "Food Habits") {
          if (each.options && each.options.length) {
            const daysCount = moment(questions[0].questions[1].answer).diff(
              moment(questions[0].questions[0].answer),
              "days"
            );
            each.options.forEach((option) => {
              if (option.value == data[each.id]) {
                ans = ans + option.factor * daysCount;
              }
            });
          }
        } else if (type == "radio") {
          if (each.options && each.options.length) {
            each.options.forEach((option) => {
              if (option.value == each.answer) {
                ans = ans + option.factor;
              }
            });
          }
        }
      });
    });

    setFinalAnswer({
      isCalculationDone: true,
      answer: ans,
    });
  };

  const onBack = () => {
    setCurrentCategoryDetails(currentCategoryDetails - 1);
  };

  const reCalculate = () => {
    setQuestions(questionsFromAPI);
    setCurrentCategoryDetails(0);
    setFinalAnswer({
      isCalculationDone: false,
      answer: 0.0,
    });
  };

  const getAnswerInDbFormat = (
    answer: any,
    type: "number" | "radio" | "date"
  ) => {
    switch (type) {
      case "date":
        return moment(answer).format("DD/MM/YYYY").toString();
      case "number":
        return String(answer);
      default:
        return String(answer);
    }
  };

  const onSaveSession = async () => {
    console.log(questions);
    // do Call
    let body: ReadonlyArray<{
      question_id : string,
      answer : string
    }> = [];
    questions.forEach((category, index) => {
      if (index > 0) {
        category.questions.forEach((question) => {
          body = [
            ...body,
            {
              "question_id" : question.id,
              answer : getAnswerInDbFormat(question.answer, question.type)
            }
          ];
        });
      }
    });
    await doCall({
      
      url: "/save-session",
      method : "POST",
      data: {
        answers: body,
        start_date : moment(questions[0].questions[0].answer).format("DD/MM/YYYY").toString(),
        end_date : moment(questions[0].questions[1].answer).format("DD/MM/YYYY").toString(),
      },
    });
    navigate("/dashboard/calculator")
  };

  const { handleSubmit, setValue, control } = useForm();

  const onStepSubmit = (data: any) => {
    setQuestions((tempQuestions) => {
      return tempQuestions.map((question, index) => {
        return index == currentCategoryDetails
          ? {
              ...question,
              questions: question.questions.map((each) => {
                return {
                  ...each,
                  answer: data[each.id],
                };
              }),
            }
          : question;
      });
    });

    if (currentCategoryDetails === questions.length - 1) {
      onSubmit(data);
    } else {
      setCurrentCategoryDetails((curr) => curr + 1);
    }
  };

  useEffect(() => {
    if (questions.length > 0) {
      questions[currentCategoryDetails].questions.forEach((question) => {
        setValue(question.id, question.answer);
      });
    }
  }, [currentCategoryDetails, setValue]);

  const getInputField = (
    field: ControllerRenderProps<FieldValues, string>,
    type: string,
    options: Array<IOption> = []
  ) => {
    switch (type) {
      case "radio":
        return (
          <>
            <RadioGroup {...field}>
              {options.map((option, index) => {
                return (
                  <React.Fragment key={index}>
                    <FormControlLabel
                      value={option.value}
                      label={option.label}
                      control={<Radio />}
                    />
                  </React.Fragment>
                );
              })}
            </RadioGroup>
          </>
        );
      case "date":
        return (
          <DatePicker
            className="calculator_form_field"
            format="DD/MM/YYYY"
            {...field}
            value={field.value ? moment(field.value) : null}
          />
        );
      case "number":
      case "input":
      case "text":
        return (
          <TextField className="calculator_form_field" type={type} {...field} />
        );
    }
  };

  return (
    <>
      {!finalAnswer.isCalculationDone ? (
        <>
          {questions.length > 0 ? (
            <div className="question_container max_width">
              <div className="category_title">
                {questions[currentCategoryDetails].category}
              </div>
              <form
                className="calculator_form"
                onSubmit={handleSubmit(onStepSubmit)}
              >
                <div className="form_container">
                  <div className="form_wrapper">
                    {questions[currentCategoryDetails].questions.map(
                      (question, index: number) => {
                        return (
                          <div key={index} className="question_box">
                            <label>{question.question}</label>
                            <Controller
                              name={question.id}
                              control={control}
                              defaultValue={null}
                              render={({ field }) => {
                                return (
                                  <>
                                    {getInputField(
                                      field,
                                      question.options &&
                                        question.options.length
                                        ? "radio"
                                        : question.type,
                                      question.options
                                    )}
                                  </>
                                );
                              }}
                            />
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
                <div className="question_footer">
                  <div className="action_item_container">
                    {currentCategoryDetails != 0 ? (
                      <button
                        type="button"
                        className="back_button"
                        onClick={onBack}
                      >
                        Back
                      </button>
                    ) : (
                      <></>
                    )}

                    {currentCategoryDetails < questions.length - 1 ? (
                      <>
                        <button type="submit" className="submit_button">
                          Next
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="submit" className="submit_button">
                          Submit
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <>
          <div className="calculation_container">
            <div className="title_box">
              {" "}
              Your estimated{" "}
              {questions[0].questions[0].answer == 0
                ? "yearly"
                : "monthly"}{" "}
              carbon footprint
            </div>
            <div className="emission_box">
              {" "}
              {finalAnswer.answer.toFixed(2)}{" "}
            </div>
            <div className="footer_title_box">
              Total CO<sub>2</sub> emission in Kgs
            </div>
            <div className="calculator_footer_action_item">
              {finalAnswer.answer > 0 && askToSave ? (
                <button className="save_session_button" onClick={onSaveSession}>
                  Save Calculation
                </button>
              ) : (
                <></>
              )}
              <button className="re_calculate_button" onClick={reCalculate}>
                Re-calculate
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
