import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

type ApiError = {
  message?: string;
  errors?: string[];
};

export function errorHandler(error: unknown, showToast = true): string {
  let message = 'Something went wrong';

  if (axios.isAxiosError<ApiError>(error)) {
    const axiosError = error as AxiosError<ApiError>;

    if (axiosError.response) {
      message =
        axiosError.response.data?.message || axiosError.response.statusText || 'Server error';
    } else if (axiosError.request) {
      message = 'No response received from server';
    } else {
      message = axiosError.message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  if (showToast) {
    toast.error(message);
  }

  return message;
}
