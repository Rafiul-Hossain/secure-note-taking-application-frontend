export type Meta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  message: string;
  data: T;
  meta?: Meta;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  interests: string[];
  createdAt?: string;
};

export type Note = {
  _id: string;
  title: string;
  content: string;
  owner: string | { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
};

export type Post = {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
};

export type InterestGroup = {
  interest: string;
  count: number;
  users: { _id: string; name: string; email: string }[];
};