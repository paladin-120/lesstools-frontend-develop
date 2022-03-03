import React from 'react';
import { observer } from 'mobx-react-lite';
import BigNumber from 'bignumber.js/bignumber';
import moment from 'moment';

import Modal from '../Modal/index';
import { useMst } from '../../../store/store';

import s from './MoreInfoModal.module.scss';

interface IMoreInfoModalProps {
  TBRprice: string;
  TBRsymbol: string;
  otherTokenPrice: string;
  otherTokenSymbol: string;
  poolCreated: string;
  totalSupply: string;
  pooledTbr: string;
}

const MoreInfoModal: React.FC<IMoreInfoModalProps> = observer(
  ({
    TBRprice,
    TBRsymbol,
    otherTokenSymbol,
    otherTokenPrice,
    poolCreated,
    totalSupply,
    pooledTbr,
  }) => {
    const { modals } = useMst();

    const handleCancel = () => {
      modals.close('MoreInfo');
    };

    return (
      <Modal handleCancel={handleCancel} isVisible={modals.openedModals.includes('MoreInfo')}>
        <div className={s.infos}>
          <div className={s.info}>
            <div className={s.info_left}>1 {otherTokenSymbol}:</div>
            <div className={s.info_right}>
              {new BigNumber(+otherTokenPrice / +TBRprice).toFormat(3)} {TBRsymbol}
            </div>
          </div>
          <div className={s.info}>
            <div className={s.info_left}>Pool Created:</div>
            <div className={s.info_right}>
              {moment(+poolCreated * 1000).format('DD/MM/YYYY hh:mm')}
            </div>
          </div>
          <div className={s.info}>
            <div className={s.info_left}>Total Supply</div>
            <div className={s.info_right}>{new BigNumber(totalSupply).toFormat(2)}</div>
          </div>
          <div className={s.info}>
            <div className={s.info_left}>Pooled TBR</div>
            <div className={s.info_right}>{((+pooledTbr / +totalSupply) * 100).toFixed(2)}%</div>
          </div>
        </div>
        <div className={s.right}>
          <div
            role="button"
            tabIndex={0}
            onKeyDown={handleCancel}
            onClick={handleCancel}
            className="modal-close"
          >
            Close
          </div>
        </div>
      </Modal>
    );
  },
);

export default MoreInfoModal;
