import type { ComponentPropsWithoutRef, ReactNode } from 'react';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  text?: string;
  icon?: ReactNode;
}

const Button = ({ icon, text, className, ...prop }: ButtonProps) => {
  const Icon = icon;
  return (
    <button
      {...prop}
      className={`flex items-center gap-2.5 border rounded-lg px-4 py-2 text-sm active:scale-95 hover:opacity-90 transition ${className}`}>
      {Icon}
      {!!text && text}
    </button>
  );
};

export default Button;
