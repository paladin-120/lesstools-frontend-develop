import React, { useRef, useState } from 'react';

import s from './Popup.module.scss';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import arrowWhite from '../../assets/img/sections/pair-explorer/arrow-white.svg';

interface IPopupProps {
  items: string[];
  defaultValue?: string;
  onChange: (value: string) => void;
  className?: any;
}

const Popup: React.FC<IPopupProps> = (props) => {
  const { items = [], onChange = () => {}, className, defaultValue = '' } = props;

  const ref = useRef<HTMLDivElement>(null);

  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [value, setValue] = useState<string>(defaultValue);

  useOnClickOutside(ref, () => setOpenPopup(false));

  return (
    <div className={`${s.dropdown} ${className}`} ref={ref}>
      <div
        className={s.label}
        role="button"
        tabIndex={0}
        onKeyDown={() => {}}
        onClick={() => setOpenPopup(true)}
      >
        <div>{value}</div>
        <img src={arrowWhite} alt="" />
      </div>

      {openPopup && (
        <div className={s.popup}>
          {items.map((item: string) => {
            return (
              <div
                key={item}
                role="button"
                tabIndex={0}
                onKeyDown={() => {}}
                onClick={() => {
                  onChange(item);
                  setValue(item);
                  setOpenPopup(false);
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Popup;
