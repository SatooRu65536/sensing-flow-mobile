import styles from './index.module.scss';
import classnames from 'classnames';

type CardProps = React.ComponentProps<'div'>;

export default function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={classnames(styles.card, className)} {...props}>
      {children}
    </div>
  );
}
