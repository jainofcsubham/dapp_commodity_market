import React, { useCallback, useEffect, useState } from "react";
import "./Category.css";

interface Question {
  question: string;
  answer: number;
  type: "input" | "radio";
  factor: number;
  options?: Array<{
    label: string;
    value: number;
    factor: number;
  }>;
}

interface Category {
  category: string;
  questions: Array<Question>;
}

interface CategoryProps {
  category: Category;
  setCategoryAnswers: (categoryWithAnswers: Category) => void;
}

export const Category = (props: CategoryProps) => {
  const { category, setCategoryAnswers } = props;

  const [localCategory, setLocalCategory] = useState<Category>(category);

  const onNumberChange = (value: number, qIndex: number) => {
    setLocalCategory((categoryVar) => {
      return {
        ...categoryVar,
        questions: categoryVar.questions.map((each, index) => {
          if (index == qIndex) return { ...each, answer: value };
          return { ...each };
        }),
      };
    });
  };

  const onTabChange = () => {
    setCategoryAnswers(localCategory);
  };

  useEffect(() => {
    setLocalCategory(category);
  }, [category]);

  const onRadioChange = useCallback((value:number,qIndex:number) => {
    let newCategory :Category= {
      ...localCategory,
      questions : localCategory.questions.map((each,index) => {
        if(index == qIndex) return {...each,answer:value}
        return {...each}
      })
    }

    setLocalCategory(newCategory)
    setCategoryAnswers(newCategory)
  },[localCategory])



  return (
    <>
      <div className=" question_wrapper">
        {localCategory.questions.map((question, index) => {
          return (
            <React.Fragment key={index}>
              <div className="question_box">
                <div className="question_box">{question.question}</div>
                <div className="input_box">
                  {question.type == "input" ? (
                    <input
                      className="number_input"
                      type="text"
                      value={question.answer}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        onNumberChange(Number(e.target.value), index)
                      }
                      onBlur={onTabChange}
                    />
                  ) : (
                    <>
                      {question.options &&
                        question.options.map((option, oIndex) => {
                          return (
                            <React.Fragment key={oIndex}>
                              <div className="radio_wrapper">
                                <label>
                                  <input
                                    className="radio_input"
                                    type="radio"
                                    value={option.value}
                                    checked={question.answer == option.value}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                      onRadioChange(Number(e.target.value),index);
                                    }}
                                  />
                                  {option.label}
                                </label>
                              </div>
                            </React.Fragment>
                          );
                        })}
                    </>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};
