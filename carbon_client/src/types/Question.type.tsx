export interface Question {
    question: string;
    answer: number;
    name : string;
    type: "input" | "radio";
    options?: Array<{
      label: string;
      value: number;
      factor: number;
    }>;
    factor: number;
  }