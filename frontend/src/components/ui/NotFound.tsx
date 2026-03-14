import { XCircle } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = ({
  title = 'Page Not Found',
  description = 'Oops! Something went wrong. Your page was not fonded.',
  linkName = 'Try Again',
  linkTo = '/',
  linkClass = 'bg-red-600 hover:bg-red-700',
  canvas = <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />,
  mainClass = 'min-h-screen',
}: {
  title?: string | null;
  description?: string | null;
  linkName?: string | null;
  linkTo?: string | null;
  linkClass?: string | null;
  mainClass?: string | null;
  canvas?: React.ReactNode | null;
}) => {
  return (
    <div className={`flex items-center justify-center p-6 ${mainClass}`}>
      <div className="p-8 max-w-md text-center">
        {canvas ? canvas : null}
        {title && <h1 className="text-2xl font-bold mb-2">{title}</h1>}
        {description && <p className="text-gray-600 mb-6">{description}</p>}
        {linkTo && (
          <Link
            to={linkTo}
            className={`inline-block text-white font-semibold px-6 py-2 rounded-xl transition ${linkClass}`}>
            {linkName}
          </Link>
        )}
      </div>
    </div>
  );
};

export default NotFound;
