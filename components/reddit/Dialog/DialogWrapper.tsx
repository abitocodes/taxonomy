import { FC, ReactNode } from "react";
import * as Dialog from '@radix-ui/react-dialog';

type DialogWrapperProps = {
  children?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

const DialogWrapper: FC<DialogWrapperProps> = ({ children, isOpen, onClose }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          {children}
          <Dialog.Close asChild>
            <button onClick={onClose}>Close</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DialogWrapper;