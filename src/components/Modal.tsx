import { Card, CardContent } from './ui/card';

type Props = {
  children: React.ReactNode;
};

const Modal = ({ children }: Props) => {
  return (
    <div className="bg-black/50 inset-0 flex justify-center items-center fixed z-50">
      <Card className="min-w-lg">
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
};

export default Modal;
