import { useContext, useEffect, useState } from "react";
import "./Calculator.css";
import { Category } from "../../components/category/Category";
import { staticQuestions } from "../../constants/CalculatorQuestions";
import { Category as CategoryType } from "../../types/Category.type";
import { CalculatorType } from "../../types/Calculator.type";
import { UtilityContextType } from "../../types/UtilityContext.type";
import { UtilityContext } from "../../context/Utility.context";
import { useSmartContract } from "../../custom_hooks/useSmartContract";
import { Contract } from "ethers";
import { parseJSON } from "../../utility/JSONParser";
import { BarContext } from "../../context/Bar";
import moment from "moment";

export const Calculator = ({ date, onFinish }: CalculatorType) => {
  const [questions, setQuestions] =
    useState<Array<CategoryType>>(staticQuestions);
  const [currentCategoryDetails, setCurrentCategoryDetails] =
    useState<number>(0);
  const { callSmartContractMethod } = useSmartContract();

  const { connectWallet, contractDetails } =
    useContext<UtilityContextType>(UtilityContext);
  const {showBar} = useContext(BarContext)
  
  useEffect(() => {
    const fetchData = async () => {
      let localContract: Contract | null = null;
      if (!contractDetails.contract) {
        localContract = (await connectWallet()).contract;
      } else {
        localContract = contractDetails.contract;
      }
      if (localContract) {
        const {
          status,
          data = "",
          error = "",
        } = await callSmartContractMethod(localContract.fetchEmissions, true, {
          from: date.valueOf(),
          to: date.valueOf(),
        });
        if (status == "SUCCESS" && data) {
          const parsedData = parseJSON(data)[0];
          let myAnswers: any = {};
          parsedData[1].forEach((each: any) => {
            if (!myAnswers[each[0]]) {
              myAnswers[each[0]] = { [each[1]]: Number(each[2]) };
            } else {
              myAnswers[each[0]] = {
                ...myAnswers[each[0]],
                [each[1]]: Number(each[2]),
              };
            }
          });
          setQuestions((prevQuestions) => {
            return prevQuestions.map((category) => {
              return {
                ...category,
                questions: category.questions.map((question) => {
                  return {
                    ...question,
                    answer: myAnswers?.[category.category]?.[question.name]
                      ? myAnswers?.[category.category]?.[question.name]
                      : 0,
                  };
                }),
              };
            });
          });
        } else {
          console.log(error);
        }
      }
    };

    fetchData();
  }, [date]);

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

  const onSubmit = async () => {
    const dataToSubmit: Array<{
      category: string;
      factor_name: string;
      value: string;
      value_type: string;
      emission_value: bigint;
    }> = new Array(50);
    let index = 0;
    questions.forEach((category) => {
      category.questions.forEach((each) => {
        if (each.type == "input") {
          dataToSubmit[index] = {
            category: category.category,
            value_type: "number",
            emission_value: BigInt(Math.trunc(each.answer * each.factor)),
            factor_name: each.name,
            value: String(each.answer),
          };
          index = index + 1;
        } else if (each.type == "radio") {
          if (each.options && each.options.length) {
            each.options.forEach((option) => {
              if (option.value == each.answer) {
                dataToSubmit[index] = {
                  category: category.category,
                  value_type: "number",
                  emission_value: BigInt(Math.floor(option.factor)),
                  factor_name: each.name,
                  value: String(each.answer),
                };
                index = index + 1;
              }
            });
          }
        }
      });
    });

    dataToSubmit.fill(
      {
        category: "",
        emission_value: BigInt(0),
        factor_name: "",
        value: "",
        value_type: "",
      },
      index,
      50
    );

    let localContract: Contract | null = null;
    if (!contractDetails.contract) {
      localContract = (await connectWallet()).contract;
    } else {
      localContract = contractDetails.contract;
    }
    if (localContract) {
      const {
        status,
        data = "",
        error = "",
      } = await callSmartContractMethod(localContract.addEmission, true, {
        date: date.valueOf(),
        emissions: dataToSubmit,
      });
      console.log("Called Add");
      if (status == "SUCCESS" && data) {
        await data.wait();
        showBar(`Emissions added for ${moment(date).format("DD MMM YYYY")}`,"success");
        onFinish();
      } else {
        console.log(error);
      }
    }
  };

  const onBack = () => {
    setCurrentCategoryDetails(currentCategoryDetails - 1);
  };

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
    </>
  );
};
