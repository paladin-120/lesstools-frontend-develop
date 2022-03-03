import { useState, useEffect, VFC } from 'react';

import backend, { IAdminToken } from '../../../services/backend';

import s from './PromotedToken.module.scss';

const PromotedToken: VFC = () => {
  const [tokenInfo, setTokenInfo] = useState<null | IAdminToken>(null);

  useEffect(() => {
    backend.getAdminTokens().then((res) => {
      if (res) {
        setTokenInfo(res.main_token);
      }
    });
  }, []);

  return tokenInfo ? (
    <a target="_blank" rel="noreferrer noopener" href={tokenInfo.address} className={s.token}>
      <div className={s.icon}>
        <img src={`https://tools.less.xyz/${tokenInfo.image}`} alt="" />
      </div>
      <div className={s.name}>{tokenInfo.name}</div>
    </a>
  ) : (
    <div />
  );
};

export default PromotedToken;
