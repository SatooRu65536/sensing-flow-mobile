import type { ComponentProps, ReactNode } from 'react';
import styles from './index.module.scss';
import classnames from 'classnames';

interface ItemProps extends ComponentProps<'p'> {
  label: string;
  value: ReactNode;
}

export default function Item({ label, value, className, ...props }: ItemProps) {
  return (
    <p className={classnames(styles.item, className)} {...props}>
      <span>{label}</span>
      <span>{value}</span>
    </p>
  );
}
