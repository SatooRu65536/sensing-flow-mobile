import styles from './index.module.scss';
import classnames from 'classnames';

type PageLayoutProps = React.ComponentProps<'main'>;

export default function PageLayout({ children, className, ...props }: PageLayoutProps) {
  return (
    <main className={classnames(styles.page_layout, className)} {...props}>
      <div>{children}</div>
    </main>
  );
}
