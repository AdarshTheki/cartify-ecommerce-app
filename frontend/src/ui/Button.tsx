import type { ComponentPropsWithoutRef, ReactNode } from 'react';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  icon?: ReactNode;
  name?: string;
}

const Button = ({ icon, name, className, ...prop }: ButtonProps) => {
  return (
    <button
      {...prop}
      className={`flex items-center gap-2.5 border rounded-lg px-4 py-2 text-sm active:scale-95 hover:opacity-90 transition ${className}`}>
      {icon}
      {!!name && name}
    </button>
  );
};

export default Button;
