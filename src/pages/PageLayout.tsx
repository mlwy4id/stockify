type Props = {
  title: String;
  button?: React.ReactNode;
  children: React.ReactNode;
};

const PageLayout = ({ title, button, children }: Props) => {
  return (
    <div className="w-full h-screen mt-4 flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-semibold">{title}</h1>
        {button}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default PageLayout;
