'use client';
import { DialogClose, DialogFooter, DialogDescription } from '../ui/dialog';

type Props = {
  children: React.ReactNode;
  button: React.ReactNode;
  cancelHandler: () => void;
};

const ConfirmationModal = ({ children, button, cancelHandler }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <DialogDescription>{children}</DialogDescription>
      <DialogFooter>
        <DialogClose onClick={cancelHandler}>
          Batal
        </DialogClose>
        {button}
      </DialogFooter>
    </div>
  );
};

export default ConfirmationModal;
