import styles from './index.module.scss';
import { Checkbox as BCheckbox, type CheckboxRootProps } from '@base-ui/react/checkbox';
import { IconCheck } from '@tabler/icons-react';
import classnames from 'classnames';

interface CheckboxProps extends CheckboxRootProps {
  label?: string;
}

export default function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className={styles.Label}>
      <BCheckbox.Root className={classnames(styles.Checkbox, className)} {...props}>
        <BCheckbox.Indicator className={styles.Indicator}>
          <IconCheck className={styles.Icon} />
        </BCheckbox.Indicator>
      </BCheckbox.Root>

      {label && <span className={styles.Text}>{label}</span>}
    </label>
  );
}
