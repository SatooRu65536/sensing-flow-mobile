import styles from './index.module.scss';
import type { ComponentProps, ReactElement } from 'react';
import classnames from 'classnames';

interface LongButtonProps extends ComponentProps<'button'> {
  icon?: ReactElement;
  danger?: boolean;
  isLoading?: boolean;
}

export default function LongButton({
  icon,
  children,
  className,
  danger,
  disabled,
  isLoading,
  ...props
}: LongButtonProps) {
  return (
    <button
      className={classnames(styles.long_button, className)}
      disabled={disabled}
      {...props}
      data-danger={danger}
      data-loading={isLoading}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children && <span className={styles.text}>{children}</span>}
    </button>
  );
}
