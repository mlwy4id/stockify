'use client';
import { Button } from '../ui/button';

type Props = {
  children: React.ReactNode;
  button: React.ReactNode;
  cancelHandler: () => void;
};

const ConfirmationModal = ({ children, button, cancelHandler }: Props) => {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div>{children}</div>
      <div className="flex justify-end items-center gap-2">
        <Button variant="outline" onClick={cancelHandler}>
          Cancel
        </Button>
        {button}
      </div>
    </div>
  );
};

export default ConfirmationModal;
