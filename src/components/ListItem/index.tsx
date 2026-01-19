import styles from './index.module.scss';
import { Link, type LinkProps } from '@tanstack/react-router';
import classnames from 'classnames';
import { IconChevronRight } from '@tabler/icons-react';
import type { ReactElement, ReactNode } from 'react';

export interface ListItemProps extends Omit<LinkProps, 'children'> {
  className?: string;
  icon?: ReactElement;
  children: ReactNode;
}

export default function ListItem({
  className,
  children,
  disabled = false,
  icon = <IconChevronRight />,
  ...props
}: ListItemProps) {
  return (
    <div className={classnames(styles.list_item, className)} data-disabled={disabled}>
      <span className={styles.content}>{children}</span>
      <Link {...props} disabled={disabled} className={styles.link}>
        {icon}
      </Link>
    </div>
  );
}
