import React from 'react';
import { observer } from 'mobx-react-lite';

import Modal from '../Modal/index';
import { useMst } from '../../../store/store';

import s from './ShareModal.module.scss';

import { ReactComponent as ShareTwitter } from '../../../assets/img/icons/share-twitter.svg';
import { ReactComponent as ShareTelegram } from '../../../assets/img/icons/share-telegram.svg';
import { ReactComponent as ShareReddit } from '../../../assets/img/icons/share-reddit.svg';

interface IMoreInfoModalProps {
  url: string;
  text: string;
}

const MoreInfoModal: React.FC<IMoreInfoModalProps> = observer(({ url, text }) => {
  const { modals } = useMst();

  const handleCancel = () => {
    modals.close('Share');
  };

  return (
    <Modal
      width="390px"
      handleCancel={handleCancel}
      isVisible={modals.openedModals.includes('Share')}
    >
      <div className={s.modal}>
        <div className={s.title}>Share on Social Media</div>
        <div className={s.links}>
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`}
            className={s.share_link}
          >
            <div className={s.share_link__img}>
              <ShareTwitter />
            </div>
            <div className={s.share_link__title}>Twitter</div>
          </a>
          <a
            className={s.share_link}
            target="_blank"
            rel="noreferrer"
            href={`https://t.me/share/url?url=${url}&text=${text}`}
          >
            <div className={s.share_link__img}>
              <ShareTelegram />
            </div>
            <div className={s.share_link__title}>Telegram</div>
          </a>
          <a
            className={s.share_link}
            target="_blank"
            rel="noreferrer"
            href={`http://www.reddit.com/submit?url=${url}&title=${text}`}
          >
            <div className={s.share_link__img}>
              <ShareReddit />
            </div>
            <div className={s.share_link__title}>Reddit</div>
          </a>
        </div>
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
});

export default MoreInfoModal;
