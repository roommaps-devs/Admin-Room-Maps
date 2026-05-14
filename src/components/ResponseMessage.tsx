"use client";
import { toast } from "sonner";

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

/** Show a toast based on the API response object */
export const ResponseMessage = (res: ApiResponse) => {
  if (res.success) {
    toast.success(res.message );
  } else {
    toast.error(res.message);
  }
};

/** Call inside every catch block — shows the error message as a toast */
export const catchResponseMessage = (err: unknown) => {
  const message =
    err instanceof Error ? err.message : "Something went wrong. Try again.";
  toast.error(message);
};