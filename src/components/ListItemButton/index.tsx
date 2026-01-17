import type { ReactElement } from 'react';
import styles from './index.module.scss';

interface ListItemButtonProps extends React.ComponentProps<'button'> {
  icon?: ReactElement;
  text?: string;
}

export default function ListItemButton({ icon, text, ...props }: ListItemButtonProps) {
  return (
    <button className={styles.list_item_button} {...props}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {text && <span className={styles.text}>{text}</span>}
    </button>
  );
}
