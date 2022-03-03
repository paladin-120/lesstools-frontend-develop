import React from 'react';
import { Modal as AntModal } from 'antd';

import 'antd/lib/modal/style/css';
import './Modal.scss';

import { ReactComponent as CloseImg } from '../../../assets/img/icons/close.svg';

interface IModalProps {
  isVisible: boolean;
  handleCancel?: () => void;
  width?: number | string;
  className?: string;
  destroyOnClose?: boolean;
  closeIcon?: boolean;
}

const Modal: React.FC<IModalProps> = ({
  children,
  isVisible,
  handleCancel,
  width,
  className,
  destroyOnClose,
}) => {
  return (
    <AntModal
      visible={isVisible}
      onCancel={handleCancel}
      width={width}
      centered
      footer={false}
      closeIcon={<CloseImg />}
      className={className}
      destroyOnClose={destroyOnClose}
    >
      {children}
    </AntModal>
  );
};

export default Modal;
