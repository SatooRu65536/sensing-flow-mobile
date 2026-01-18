import styles from './index.module.scss';
import type { ButtonHTMLAttributes } from 'react';
import classnames from 'classnames';

interface FloatButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  as?: React.ElementType;
}

export default function FloatButton({ children, className, as = 'button', ...props }: FloatButtonProps) {
  const Component = as;
  return (
    <Component className={classnames(styles.float_button, className)} {...props}>
      {children}
    </Component>
  );
}
