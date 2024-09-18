import { ReactNode } from 'react';

type PageSideBarProps = {
  // eslint-disable-next-line react/require-default-props
  children?: ReactNode | ReactNode[] | undefined;
};

export default function PageSideBar({ children }: PageSideBarProps) {
  return <div className="PageSideBar hidden-scrollbar">{children}</div>;
}
