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
          name : "petrol",
        },
        {
          question: "Enter the amount of diesel consumption(litre)",
          type: "input",
          answer: 0,
          factor: 2.71,
          name : "diesel",
        },
        {
          question: "Enter the amount of LPG/CNG consumption(kg/litre)",
          type: "input",
          answer: 0,
          factor: 2.07,
          name : "lpg/cng",
        },
        {
          question: "Enter the amount of Coal consumption(kg)",
          type: "input",
          answer: 0,
          factor: 2.5,
          name : "coal",
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
          name : "electricity",
        },
      ],
    },
    {
      category: "Travel",
      questions: [
        {
          question: "Enter the distance traveled in Flights(km) ",
          answer: 0,
          type: "input",
          factor: 0.121,
          name : "flights",
        },
        {
          question: "Enter the distance traveled in Trains(km) ",
          answer: 0,
          type: "input",
          factor: 0.0078,
          name : "trains",
        },
        {
          question: "Enter the distance traveled in Metro(km)",
          answer: 0,
          type: "input",
          factor: 0.0139,
          name : "metro",
        },
        {
          question: "Enter the distance traveled in Bus(km)",
          answer: 0,
          type: "input",
          factor: 0.054,
          name : "bus",
        },
        {
          question: "Enter the distance traveled in Electric Bus(km)",
          answer: 0,
          type: "input",
          factor: 0.03782,
          name : "e_bus",
        },
        {
          question: "Enter the distance traveled in Car(km)",
          answer: 0,
          type: "input",
          factor: 0.1431,
          name : "car",
        },
        {
          question: "Enter the distance traveled in Electric Car(km)",
          answer: 0,
          type: "input",
          factor: 0.1035,
          name : "e_car",
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
          name : 'meal',
          factor: 0,
          options: [
            {
              label: "Vegan Diet",
              value: 1,
              factor: 2019/365,
              // factor: 2019,
            },
            {
              label: "Vegetarian Diet",
              value: 2,
              factor: 2176/365,
            },
            {
              label: "Non-Vegetarian Diet - Rarely",
              value: 3,
              factor: 2412/365,
            },
            {
              label: "Non-Vegetarian Diet - Sometimes",
              value: 4,
              factor: 3017/365,
            },
            {
              label: "Non-Vegetarian Diet - Regularly",
              value: 5,
              factor: 3781/365,
            },
          ],
        },
      ],
    },
  ];
  