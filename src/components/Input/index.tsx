import styles from './index.module.scss';
import { Input as BInput } from '@base-ui/react/input';
import classnames from 'classnames';

type InputProps = React.ComponentProps<typeof BInput>;

export default function Input({ className, ...props }: InputProps) {
  return <BInput className={classnames(styles.input, className)} {...props} />;
}
