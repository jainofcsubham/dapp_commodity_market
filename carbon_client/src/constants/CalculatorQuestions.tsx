import { Category } from "../types/Category.type";

export const  staticQuestions: Array<Category> = [
    {
      category: "Fuel Consumption",
      questions: [
        {
          question: "Enter the amount of petrol consumption(litre)",
          type: "input",
          answer: 0,
          factor: 2.34,
        },
        {
          question: "Enter the amount of diesel consumption(litre)",
          type: "input",
          answer: 0,
          factor: 2.71,
        },
        {
          question: "Enter the amount of LPG/CNG consumption(kg/litre)",
          type: "input",
          answer: 0,
          factor: 2.07,
        },
        {
          question: "Enter the amount of Coal consumption(kg)",
          type: "input",
          answer: 0,
          factor: 2.5,
        },
      ],
    },
    {
      category: "Energy Consumption",
      questions: [
        {
          question:
            "Enter the amount of electricity consumed from non-renewable resources(kwh)",
          type: "input",
          answer: 0,
          factor: 0.708,
        },
      ],
    },
    {
      category: "Travel",
      questions: [
        {
          question: "Enter the distance travelled in Flights(km) ",
          answer: 0,
          type: "input",
          factor: 0.121,
        },
        {
          question: "Enter the distance travelled in Trains(km) ",
          answer: 0,
          type: "input",
          factor: 0.0078,
        },
        {
          question: "Enter the distance travelled in Metro(km)",
          answer: 0,
          type: "input",
          factor: 0.0139,
        },
        {
          question: "Enter the distance travelled in Bus(km)",
          answer: 0,
          type: "input",
          factor: 0.054,
        },
        {
          question: "Enter the distance travelled in Electric Bus(km)",
          answer: 0,
          type: "input",
          factor: 0.03782,
        },
        {
          question: "Enter the distance travelled in Car(km)",
          answer: 0,
          type: "input",
          factor: 0.1431,
        },
        {
          question: "Enter the distance travelled in Electric Car(km)",
          answer: 0,
          type: "input",
          factor: 0.1035,
        },
      ],
    },
    {
      category: "Food Habits",
      questions: [
        {
          question: "Please choose your meal preference",
          answer: 0,
          type: "radio",
          factor: 0,
          options: [
            {
              label: "Vegan Diet",
              value: 1,
              factor: Math.ceil(2019/365),
              // factor: 2019,
            },
            {
              label: "Vegetarian Diet",
              value: 2,
              factor: Math.ceil(2176/365),
            },
            {
              label: "Non-Vegetarian Diet - Rarely",
              value: 3,
              factor: Math.ceil(2412/365),
            },
            {
              label: "Non-Vegetarian Diet - Sometimes",
              value: 4,
              factor: Math.ceil(3017/365),
            },
            {
              label: "Non-Vegetarian Diet - Regularly",
              value: 5,
              factor: Math.ceil(3781/365),
            },
          ],
        },
      ],
    },
  ];
  