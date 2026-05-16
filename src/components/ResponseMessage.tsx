"use client";
import { toast } from "sonner";

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode?: number;
  message: string;
  data?: T;
  type?: 'success' | 'error' | 'info' | 'warning';
}

/** Show a toast based on the API response object */
export const ResponseMessage = (res: ApiResponse<unknown>) => {
  if (res.type) {
    if (res.type === 'success') toast.success(res.message);
    else if (res.type === 'error') toast.error(res.message);
    else if (res.type === 'info') toast.info(res.message);
    else if (res.type === 'warning') toast.warning(res.message);
    return;
  }

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