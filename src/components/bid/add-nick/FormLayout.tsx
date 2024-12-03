import classNames from 'classnames';
import React from 'react';

interface FormLayoutProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  containerStyle?: string;
}
export const FormLayout = ({ title, children, className, containerStyle }: FormLayoutProps) => {
  return (
    <div className={classNames('text-ic-ink-6s', containerStyle)}>
      <p className="font-medium">{title}</p>
      <div className={classNames('mt-3 p-3 rounded-lg bg-ic-light', className)}>{children}</div>
    </div>
  );
};
