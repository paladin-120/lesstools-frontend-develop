import React from 'react';
import s from './Type.module.scss';

interface ITypeProps {
  type: 'buy' | 'sell';
}

const Type: React.FC<ITypeProps> = React.memo(({ type }) => {
  return <div className={`${s.type} ${type === 'buy' ? s.green : s.red}`}>{type}</div>;
});

export default Type;
