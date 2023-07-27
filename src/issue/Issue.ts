import { HumanDate } from '../shared/HumanDate';

export type Issue = {
  id: string;
  date: HumanDate;
  firstSeenDate: HumanDate;
  errorMessage: string;
  title: string;
  amount: number;
  link: string;
};
