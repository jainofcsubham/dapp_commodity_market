import { Moment } from "moment";

export interface CalculatorType {
    date : Moment,
    onFinish : () => void
  }