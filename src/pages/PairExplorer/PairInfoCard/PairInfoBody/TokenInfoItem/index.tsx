import React from 'react';

import { copyText } from '../../../../../utils/copyText';

import s from '../PairInfoBody.module.scss';

interface ITokenInfoItemProps {
  title: string;
  value: string;
  copy?: boolean;
  copyValue?: string;
}

const TokenInfoItem: React.FC<ITokenInfoItemProps> = ({ title, value, copy, copyValue }) => {
  return (
    <div className={`${s.token_info__item} ${copy && s.copy}`}>
      <div className={s.token_info__item__title}>{title}</div>
      {copy ? (
        <button
          data-tip="Click to copy"
          data-effect="solid"
          type="button"
          onClick={() => copyText(copyValue || '')}
          className={s.token_info__item__value}
        >
          {value}
        </button>
      ) : (
        <div className={s.token_info__item__value}>{value}</div>
      )}
    </div>
  );
};

export default TokenInfoItem;
