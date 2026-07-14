import { createUnit, getUnits } from '@/shared/lib/api/unit.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useGetUnits = () => {
  return useQuery({
    queryKey: ['Unit'],
    queryFn: getUnits,
    staleTime: 100 * 30,
  });
};

export const UseCreateUnit = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Unit'] });
    },
    onSettled: () => {
      router.back();
    },
  });
};
