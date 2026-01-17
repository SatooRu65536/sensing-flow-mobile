import styles from './index.module.scss';
import { Link, type LinkProps } from '@tanstack/react-router';
import classnames from 'classnames';
import { IconChevronRight } from '@tabler/icons-react';
import type { ReactElement } from 'react';

interface ListItemProps extends LinkProps {
  className?: string;
  icon?: ReactElement;
}

export default function ListItem({
  className,
  children,
  disabled = false,
  icon = <IconChevronRight />,
  ...props
}: ListItemProps) {
  return (
    <Link className={classnames(styles.list_item, className)} {...props} disabled={disabled}>
      {(linkProps) => (
        <>
          <span className={styles.content}>{typeof children === 'function' ? children(linkProps) : children}</span>
          {icon}
        </>
      )}
    </Link>
  );
}
