import { useIsFetching } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import LoadingBar, { type LoadingBarRef } from 'react-top-loading-bar';

type Props = {
  children: React.ReactNode;
};

export const GlobalTopLoadingBar = ({ children }: Props) => {
  const barRef = useRef<LoadingBarRef>(null);
  const isFetching = useIsFetching();

  const isLoading = isFetching > 0;

  useEffect(() => {
    if (isLoading) {
      barRef.current?.continuousStart();
    } else {
      barRef.current?.complete();
    }
  }, [isLoading]);

  return (
    <>
      <LoadingBar ref={barRef} color="#4f46e5" height={3} shadow />
      {children}
    </>
  );
};
