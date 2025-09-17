const Input = ({
  label = '',
  name = '',
  type = 'text',
  className = '',
  ...rest
}) => {
  return (
    <div className="flex flex-col mb-4">
      {label && (
        <label htmlFor={name} className="text-sm mb-1">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        className={`border border-gray-300 rounded outline-indigo-300 px-3 py-2 ${className}`}
        {...rest}
      />
    </div>
  );
};

export default Input;
