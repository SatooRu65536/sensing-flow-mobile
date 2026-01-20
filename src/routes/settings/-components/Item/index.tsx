import type { ComponentProps, ReactNode } from 'react';
import styles from './index.module.scss';
import classnames from 'classnames';

interface ItemProps extends ComponentProps<'p'> {
  label: string;
  value: ReactNode;
}

export default function Item({ label, value, className, ...props }: ItemProps) {
  return (
    <div className={classnames(styles.item, className)} {...props}>
      <span className={styles.label}>{label}:</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}
