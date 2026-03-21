import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

type ApiError = {
  message?: string;
  errors?: string[];
};

export function errorHandler(error: unknown, showToast = true): string {
  let message = 'Something went wrong';

  if (axios.isAxiosError<ApiError>(error)) {
    const err = error as AxiosError<ApiError>;

    if (err.response) {
      message = err.response.data?.message || 'Server Error';
    } else if (err.request) {
      message = 'No response from server';
    } else {
      message = 'Unexpected error';
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  if (showToast) {
    toast.error(message);
  }

  return message;
}
