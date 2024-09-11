import { ReactNode } from 'react';

type AppContentProps = {
  children: ReactNode;
};

export default function AppContent({ children }: AppContentProps) {
  return <div className="AppContent">{children}</div>;
}
