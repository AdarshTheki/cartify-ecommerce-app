import { Check } from 'lucide-react';
import React from 'react';

type SelectProp = {
  onSelected: (v: string) => void;
  selected: string;
  options: { name: string; value: string }[];
  className?: string;
  name?: string;
};

const Select: React.FC<SelectProp> = ({
  options,
  onSelected,
  selected,
  className,
  name = 'Filter',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (item: string) => {
    onSelected(item);
    setIsOpen(false);
  };

  return (
    <div className='relative text-sm'>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className={`flex justify-between h-full items-center rounded-md w-full border !border-gray-400 px-4 gap-2`}>
        <span className='text-nowrap capitalize'>
          {name || options.find((o) => o.value === selected)?.name || selected}
        </span>
        <svg
          className={`w-5 h-5 inline float-right transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke='#4b5563'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {isOpen && <div className='fixed inset-0' onClick={() => setIsOpen(false)}></div>}

      {isOpen && (
        <ul
          className={`top-10 absolute min-w-[200px] max-h-[300px] overflow-y-auto z-30 bg-white border border-gray-300 w-full rounded-md shadow-lg mt-1 py-2 ${className}`}>
          {options.map((option) => (
            <li
              key={option.value}
              className='px-4 capitalize py-2 hover:bg-gray-800 hover:text-white cursor-pointer flex items-center gap-1 duration-300 truncate w-full'
              onClick={() => handleSelect(option.value)}>
              {option.value === selected ? (
                <Check size={16} />
              ) : (
                <Check size={16} style={{ visibility: 'hidden' }} />
              )}
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
