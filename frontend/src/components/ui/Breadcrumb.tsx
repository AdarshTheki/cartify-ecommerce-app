import { ChevronRight } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb: React.FC<{ paths: { label: string; to: string }[] }> = ({
  paths,
}) => {
  return (
    <nav className="text-gray-600 text-sm">
      <ul className="flex items-center space-x-2">
        {paths.map((path, index) => (
          <li key={index} className="flex items-center">
            <Link
              to={path.to}
              className="hover:text-indigo-500 mr-2 capitalize">
              {path.label}
            </Link>
            {index < paths.length - 1 && <ChevronRight size={16} />}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
