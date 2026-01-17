import styles from './index.module.scss';
import classnames from 'classnames';

interface SectionLayoutProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  title: string;
  center?: boolean;
}

export default function SectionLayout({ children, className, title, center = false, ...props }: SectionLayoutProps) {
  return (
    <section {...props} className={classnames(styles.section_layout, className)}>
      <h2 data-center={center}>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
