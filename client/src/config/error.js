import { toast } from 'react-toastify';

const errorHandler = (error) => {
  const { response, request, message } = error || {};

  if (response) {
    const status = response.status;
    const errorMsg = response.data?.message || 'Something went wrong.';

    if (status === 401) {
      toast.error('Unauthorized access. Please login again.');
    } else if (status === 403) {
      toast.error("Forbidden. You don't have permission.");
    } else {
      toast.error(errorMsg);
    }
  } else if (request) {
    toast.error(
      'No response received from the server. Please check your network.'
    );
  } else {
    toast.error(message || 'An unexpected error occurred.');
  }
};

export default errorHandler;
