import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '../../utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon; // Added support for Lucide icons
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, name, icon: Icon, ...props }, ref) => {
    const generatedId = useId();
    const inputId = name || generatedId;

    return (
      <div className='flex flex-col gap-1.5 w-full'>
        {label && (
          <label htmlFor={inputId} className='capitalize text-sm font-medium text-gray-700'>
            {label}
          </label>
        )}
        <div className='relative flex items-center'>
          {Icon && <Icon className='absolute left-3 text-gray-500' size={18} strokeWidth={2} />}
          <input
            id={inputId}
            name={name}
            type={type}
            placeholder={props.placeholder || cn('Please enter', label || name)}
            className={cn(
              'flex h-10 w-full rounded-md border !border-gray-400 bg-white py-2 px-4 text-sm transition-colors focus:outline-none focus:ring focus:ring-gray-800 disabled:cursor-not-allowed disabled:opacity-50',
              Icon && 'pl-10', // Adjust padding if icon exists
              className,
            )}
            ref={ref}
            {...props}
          />
        </div>
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
