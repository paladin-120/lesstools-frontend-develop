import { types } from 'mobx-state-tree';

type ModalsTypes = 'MoreInfo' | 'Share' | 'Trade' | 'Info';

const Modals = types
  .model({
    openedModals: types.array(
      types.union(
        types.literal('MoreInfo'),
        types.literal('Share'),
        types.literal('Trade'),
        types.literal('Info'),
      ),
    ),
    modalText: types.string,
  })
  .actions((self) => ({
    open(modalName: ModalsTypes, modalText?: string) {
      self.openedModals.push(modalName);
      if (modalText) self.modalText = modalText;
    },
    close(modalName: ModalsTypes) {
      // TODO: как обозначить нормально типы в MST?
      // eslint-disable-next-line
      // @ts-ignore
      self.openedModals = self.openedModals.filter((modal) => modal !== modalName);
      self.modalText = '';
    },
  }));

export default Modals;
