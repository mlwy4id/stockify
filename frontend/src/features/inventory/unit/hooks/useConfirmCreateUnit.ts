import { UseCreateUnit } from '@/features/inventory/unit/hooks/queries/unit.query';

export const UseConfirmCreateUnit = () => {
  const { mutate, isPending } = UseCreateUnit();

  const confirmCreate = (unit: any) => {
    mutate(unit);
  };

  return { confirmCreate, isPending };
};
