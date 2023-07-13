export type Issue = {
  id: string;
  date: Date;
  errorMessage: string;
  title: string;
  amount: number;
};

export type IssueList = { label: string; children: Issue[] }[];
