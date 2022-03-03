import { VFC } from 'react';

import s from './HotTokenAdmin.module.scss';

interface IProps {
  index: number;
  name: string;
  icon: string;
  href: string;
}

const HotTokenAdmin: VFC<IProps> = ({ index, name, icon, href }) => {
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className={s.token}>
      <div className={s.name}>
        <span>#{index}</span>
        <div>{name}</div>
      </div>
      <div className={s.image}>
        <img src={`https://tools.less.xyz/${icon}`} alt="token logo" />
      </div>
    </a>
  );
};

export default HotTokenAdmin;
