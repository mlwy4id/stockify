type Props = {
  title: string;
  button?: React.ReactNode;
  children: React.ReactNode;
};

const PageLayout = ({ title, button, children }: Props) => {
  return (
    <div className="w-full h-screen pt-4 md:pt-10 flex flex-col gap-2">
      <div className="flex justify-between items-start mb-2">
        <h1 className="text-2xl md:text-3xl font-bold heading">{title}</h1>
        {button}
      </div>
      <div className="pb-8 flex flex-col gap-4">{children}</div>
    </div>
  );
};

export default PageLayout;
