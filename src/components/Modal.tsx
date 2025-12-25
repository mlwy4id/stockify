import { LuX } from "react-icons/lu";
import { Card, CardContent, CardHeader } from "./ui/card";

type Props = {
  title: string;
  children: React.ReactNode;
  closeModal: () => void;
};

const Modal = ({ title, children, closeModal }: Props) => {
  return (
    <div className="bg-black/50 inset-0 flex justify-center items-center fixed z-50">
      <Card className="min-w-lg">
        <CardHeader className="flex justify-between items-start">
          <h3 className="font-semibold text-xl">{title}</h3>
          <LuX onClick={() => closeModal()} />
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
};

export default Modal;
