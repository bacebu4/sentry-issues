export type Issue = {
  id: string;
  date: Date;
  errorMessage: string;
  labels: string[];
  amount: number;
};

export type IssueList = { label: string; children: { label: string; children: Issue[] }[] }[];
