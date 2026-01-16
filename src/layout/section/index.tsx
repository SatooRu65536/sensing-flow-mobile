import styles from './index.module.scss';
import classnames from 'classnames';

interface SectionLayoutProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  title: string;
}

export default function SectionLayout({ children, className, title, ...props }: SectionLayoutProps) {
  return (
    <section {...props} className={classnames(styles.section_layout, className)}>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
