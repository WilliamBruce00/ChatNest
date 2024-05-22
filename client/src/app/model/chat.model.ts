export interface Chat {
  _id?: string;
  sender?: string;
  recipient?: string;
  message?: string;
  createAt?: string;
  seen?: string[];
  type?: string;
}
