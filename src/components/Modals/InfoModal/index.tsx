import React from 'react';
import { observer } from 'mobx-react-lite';

import Modal from '../Modal/index';
import { useMst } from '../../../store/store';

import s from './InfoModal.module.scss';

const InfoModal: React.FC = observer(() => {
  const { modals } = useMst();

  const handleCancel = () => {
    modals.close('Info');
  };

  return (
    <Modal handleCancel={handleCancel} isVisible={modals.openedModals.includes('Info')}>
      <div className={s.modal}>
        <div className={s.modal_text}>{modals.modalText}</div>
        <div
          role="button"
          tabIndex={0}
          onKeyDown={handleCancel}
          onClick={handleCancel}
          className="modal-close"
        >
          Ok
        </div>
      </div>
    </Modal>
  );
});

export default InfoModal;
