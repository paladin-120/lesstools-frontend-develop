import React from 'react';
import { observer } from 'mobx-react-lite';

import Modal from '../Modal/index';
import { useMst } from '../../../store/store';

import s from './TradeModal.module.scss';

interface ITradeModalProps {
  tokenId: string;
}

const TradeModal: React.FC<ITradeModalProps> = observer(({ tokenId = '' }) => {
  const { modals, currentExchange } = useMst();

  const handleCancel = () => {
    modals.close('Trade');
  };

  return (
    <Modal handleCancel={handleCancel} isVisible={modals.openedModals.includes('Trade')}>
      <div className={s.modal}>
        <iframe
          title="buy"
          src={
            currentExchange.exchange === 'uniswap'
              ? `https://app.uniswap.org/#/swap?outputCurrency=${tokenId}&use=V3`
              : 'https://app.sushi.com/swap'
          }
          height="660px"
          width="100%"
          id="myId"
          style={{
            border: '0',
            margin: '0 auto',
            display: 'block',
            borderRadius: '0px',
            maxWidth: '600px',
            minWidth: '300px',
          }}
        />
      </div>
    </Modal>
  );
});

export default TradeModal;
