'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

type Props = {
  title: string;
  children: React.ReactNode;
  closeModal: () => void;
};

const Modal = ({ title, children, closeModal }: Props) => {
  return (
    <Dialog open onOpenChange={(open) => !open && closeModal()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
