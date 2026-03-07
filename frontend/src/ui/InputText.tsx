import * as React from 'react';
import { cn } from '../utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, name, ...props }, ref) => {
    const id = React.useId();

    return (
      <div className='flex flex-col gap-0.5 w-full'>
        {label && (
          <label htmlFor={name || id} className='capitalize text-sm font-medium text-gray-700'>
            {label}
          </label>
        )}
        <input
          id={name || id}
          name={name}
          placeholder={cn('Please enter', label || name)}
          type={type}
          className={cn('flex h-10 w-full rounded-md border py-2 px-4 border-gray-400', className)}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
