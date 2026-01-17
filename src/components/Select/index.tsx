import styles from './index.module.scss';
import { Select as BSelect } from '@base-ui/react/select';
import { Field } from '@base-ui/react/field';
import { IconSelector, IconCheck } from '@tabler/icons-react';

export interface SelectItem {
  label: string;
  value: string;
}

interface SelectProps extends React.ComponentProps<typeof BSelect.Root> {
  label?: string;
  items: SelectItem[];
  placeholder?: string;
}

export default function Select({ label, items, placeholder, ...props }: SelectProps) {
  return (
    <Field.Root className={styles.Field}>
      {label && (
        <Field.Label className={styles.Label} nativeLabel={false} render={<div />}>
          {label}
        </Field.Label>
      )}

      <BSelect.Root items={items} {...props}>
        <BSelect.Trigger className={styles.Select}>
          <BSelect.Value className={styles.Value} placeholder={placeholder} />
          <BSelect.Icon className={styles.SelectIcon}>
            <IconSelector />
          </BSelect.Icon>
        </BSelect.Trigger>

        <BSelect.Portal>
          <BSelect.Positioner className={styles.Positioner}>
            <BSelect.Popup className={styles.Popup}>
              <BSelect.ScrollUpArrow className={styles.ScrollArrow} />

              <BSelect.List className={styles.List}>
                {items.map(({ label, value }) => (
                  <BSelect.Item key={label} value={value} className={styles.Item}>
                    <BSelect.ItemIndicator className={styles.ItemIndicator}>
                      <IconCheck className={styles.ItemIndicatorIcon} />
                    </BSelect.ItemIndicator>
                    <BSelect.ItemText className={styles.ItemText}>{label}</BSelect.ItemText>
                  </BSelect.Item>
                ))}
              </BSelect.List>

              <BSelect.ScrollDownArrow className={styles.ScrollArrow} />
            </BSelect.Popup>
          </BSelect.Positioner>
        </BSelect.Portal>
      </BSelect.Root>
    </Field.Root>
  );
}
