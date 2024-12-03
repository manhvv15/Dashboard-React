import classNames from 'classnames';
import { useState } from 'react';

interface SwitchProps {
  onChange?: (value: boolean) => void;
  deFaultChecked?: boolean;
  disabled?: boolean;
}
export const CustomSwitch = ({ onChange, deFaultChecked = false, disabled = false }: SwitchProps) => {
  const [isChecked, setIsChecked] = useState(deFaultChecked);
  const handleClick = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    if (onChange) {
      onChange(newState);
    }
  };
  return (
    <div className="w-[34px] h-5 flex justify-center items-center relative">
      <input
        className={classNames(
          'h-4 w-full appearance-none rounded-lg cursor-pointer after:absolute duration-200',
          'after:h-5 after:w-5 after:top-0 after:rounded-full after:bg-primary-6 after:transition-[background-color_0.2s,transform_0.2s]',
          isChecked ? 'checked:after:ml-[15px] bg-blue-4' : 'after:-ml-[1px] bg-ic-ink-3s',
        )}
        type="checkbox"
        role="switch"
        checked={isChecked}
        disabled={disabled}
        onChange={handleClick}
      />
    </div>
  );
};
