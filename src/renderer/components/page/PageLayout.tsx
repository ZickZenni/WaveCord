import { ReactNode } from 'react';

type PageLayoutProps = {
  children: ReactNode;
};

export default function PageLayout({ children }: PageLayoutProps) {
  return <div className="PageLayout">{children}</div>;
}
