import styles from './index.module.scss';
import type { ButtonHTMLAttributes } from 'react';
import classnames from 'classnames';

type FloatButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function FloatButton({ children, className, ...props }: FloatButtonProps) {
  return (
    <button className={classnames(styles.float_button, className)} {...props}>
      {children}
    </button>
  );
}
