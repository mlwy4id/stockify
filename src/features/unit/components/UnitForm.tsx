import { Button, Input } from '@/shared/components';

type Props = {
  submitBtn: React.ReactNode;
};

const UnitForm = ({ submitBtn }: Props) => {
  return (
    <form className="w-full h-full flex flex-col gap-4 font-jakarta-sans">
      <div className="grid gap-2">
        <label htmlFor="unitName">Unit Name:</label>
        <Input id="unitName" type="text" placeholder="(e.g. Kilogram)" />
        {/* {errors.name && <p className="text-red-500">{errors.name.message}</p>} */}
      </div>

      <div className="grid gap-2">
        <label htmlFor="unitSymbol">Unit Symbol:</label>
        <Input id="unitSymbol" type="text" placeholder="(e.g. kg)" />
        {/* {errors.name && <p className="text-red-500">{errors.name.message}</p>} */}
      </div>

      <div className="flex justify-end items-center gap-2">
        <Button variant="outline">Cancel</Button>
        {submitBtn}
      </div>
    </form>
  );
};

export default UnitForm;
