import { Question } from "./Question.type";

export interface Category {
    category: string;
    questions: Array<Question>;
  }