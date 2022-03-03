import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import s from '../Table.module.scss';

const TokenName: React.FC<{ token: string; pairId: string }> = React.memo(({ token, pairId }) => {
  const location = useLocation();
  const network = location.pathname.split('/')[1].toLowerCase();

  return (
    <Link to={`/${network}/pair-explorer/${pairId}`} className={s.token}>
      <span>{token}</span>
    </Link>
  );
});

export default TokenName;
