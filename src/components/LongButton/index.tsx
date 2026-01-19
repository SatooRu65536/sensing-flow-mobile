import styles from './index.module.scss';
import type { ComponentProps, ReactElement } from 'react';
import classnames from 'classnames';

interface LongButtonProps extends ComponentProps<'button'> {
  icon?: ReactElement;
  danger?: boolean;
}

export default function LongButton({ icon, children, className, danger, disabled, ...props }: LongButtonProps) {
  return (
    <button className={classnames(styles.long_button, className)} disabled={disabled} {...props} data-danger={danger}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children && <span className={styles.text}>{children}</span>}
    </button>
  );
}
