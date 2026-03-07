import { Check } from 'lucide-react';
import React from 'react';

type SelectProp = {
  onSelected: (v: string) => void;
  selected: string;
  list: string[];
  label?: string;
  className?: string;
};

const Select: React.FC<SelectProp> = ({
  list = [],
  onSelected,
  selected,
  label,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (item: string) => {
    onSelected(item);
    setIsOpen(false);
  };

  return (
    <div className="relative text-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-10 rounded-md w-full border items-center px-4 gap-2 !border-gray-400 ${
          isOpen && 'outline-gray-800 outline ring-offset-1'
        }`}>
        <span className="text-nowrap capitalize">
          {(label || selected).substring(0, 18)}
        </span>
        <svg
          className={`w-5 h-5 inline float-right transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#4b5563">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0" onClick={() => setIsOpen(false)}></div>
      )}

      {isOpen && (
        <ul
          className={`top-10 absolute max-h-[300px] overflow-y-auto z-30 bg-white border border-gray-300 w-full rounded-md shadow-lg mt-1 py-2 ${className}`}>
          {list.map((country) => (
            <li
              key={country}
              className="px-4 capitalize py-2 hover:bg-gray-800 hover:text-white cursor-pointer flex items-center gap-1 duration-300"
              onClick={() => handleSelect(country)}>
              {country === selected ? (
                <Check size={16} />
              ) : (
                <Check size={16} style={{ visibility: 'hidden' }} />
              )}
              {country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
