import { createUnit, getUnits } from '@/shared/lib/api/unit.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useGetUnits = () => {
  return useQuery({
    queryKey: ['Unit'],
    queryFn: getUnits,
    staleTime: 100 * 30,
  });
};

export const UseCreateUnit = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Unit'] });
    },
    onSettled: () => {
      navigate(-1);
    },
  });
};
