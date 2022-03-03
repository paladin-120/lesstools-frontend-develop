import { useState } from 'react';
import classnames from 'classnames';

import s from './Checkbox.module.scss';

type CheckboxType = 'default' | 'light' | 'button';

interface Props {
  onClick: (value: boolean) => void;
  children: any[] | any;
  className?: string;
  type?: CheckboxType;
  checked?: boolean;
}

const Checkbox = ({ onClick, children, type = 'default', checked = false, ...props }: Props) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  const handleClick = () => {
    setIsChecked(!isChecked);
    onClick(isChecked);
  };

  return (
    <div className={classnames(s.container, s[type], checked && s.checked)}>
      <button
        type="button"
        onClick={handleClick}
        className={classnames(s.checkbox, s[type], checked && s.checked)}
        {...props}
      >
        {children}
      </button>
    </div>
  );
};

export default Checkbox;
