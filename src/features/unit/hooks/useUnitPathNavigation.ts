import { useNavigate } from 'react-router-dom';

export const useUnitPathNavigation = () => {
  const navigate = useNavigate();

  return {
    toCreateUnit: () => navigate('/inventory/unit/add'),
  };
};
