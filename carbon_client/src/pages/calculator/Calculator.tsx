import { useState } from "react";
import "./Calculator.css";
import { Category } from "../../components/category/Category";
import { staticQuestions } from "../../constants/CalculatorQuestions";
import { Category as CategoryType } from "../../types/Category.type";
import { CalculatorType } from "../../types/Calculator.type";


export const Calculator = ({date,onFinish} : CalculatorType) => {
  const [questions, setQuestions] =
    useState<Array<CategoryType>>(staticQuestions);

  const [finalAnswer, setFinalAnswer] = useState<{
    isCalculationDone: boolean;
    answer: number;
  }>({
    isCalculationDone: false,
    answer: 0,
  });

  const [currentCategoryDetails, setCurrentCategoryDetails] =
    useState<number>(0);

  const onNext = () => {
    setCurrentCategoryDetails(currentCategoryDetails + 1);
  };

  const setCategoryAnswers = (categoryWithAnswers: CategoryType) => {
    setQuestions((currQuestions) => {
      return currQuestions.map((question, index) => {
        if (index == currentCategoryDetails) {
          return { ...categoryWithAnswers };
        }
        return { ...question };
      });
    });
  };

  const onSubmit = () => {
    let ans = 0;
    questions.forEach((category) => {
      category.questions.forEach((each) => {
        if (each.type == "input") {
          ans = ans + each.answer * each.factor;
        }
        // else if (each.type == "radio" && category.category == "Food Habits") {
        //   if (each.options && each.options.length) {
        //     let dividingFactor = questions[0].questions[0].answer == 0 ? 1 : 12;
        //     each.options.forEach((option) => {
        //       if (option.value == each.answer) {
        //         ans = ans + (option.factor/dividingFactor);
        //       }
        //     });
        //   }
        // }
        else if (each.type == "radio") {
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

    // @TODO: Call addEmission method
  };

  const onBack = () => {
    setCurrentCategoryDetails(currentCategoryDetails - 1);
  };

  // const reCalculate = () => {
  //   setQuestions(staticQuestions);
  //   setCurrentCategoryDetails(0);
  //   setFinalAnswer({
  //     isCalculationDone: false,
  //     answer: 0.0,
  //   });
  // };

  return (
    <>
      <>
        <div className="question_container">
          <div className="category_title">
            {questions[currentCategoryDetails].category}
          </div>
          <div className="form_container">
            <Category
              category={questions[currentCategoryDetails]}
              setCategoryAnswers={setCategoryAnswers}
            />
          </div>
          <div className="question_footer">
            <div className="action_item_container">
              {currentCategoryDetails != 0 ? (
                <button className="back_button" onClick={onBack}>
                  Back
                </button>
              ) : (
                <></>
              )}

              {currentCategoryDetails < questions.length - 1 ? (
                <>
                  <button className="submit_button" onClick={onNext}>
                    Next
                  </button>
                </>
              ) : (
                <>
                  <button className="submit_button" onClick={onSubmit}>
                    Submit
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </>
      {/* {!finalAnswer.isCalculationDone ? (
        <></>
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
            <button className="re_calculate_button" onClick={reCalculate}>
              Re-calculate
            </button>
          </div>
        </>
      )} */}
    </>
  );
};
