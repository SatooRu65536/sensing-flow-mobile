import styles from './index.module.scss';
import { Select as BSelect, type SelectRootProps } from '@base-ui/react/select';
import { IconSelector, IconCheck } from '@tabler/icons-react';

export interface SelectItem {
  label: string;
  value: string | number;
}

export interface GroupedSelectItem {
  label: string;
  items?: SelectItem[];
}

export type SelectItems = SelectItem[] | undefined;
export type GroupedSelectItems = GroupedSelectItem[] | undefined;

interface SelectProps<T> extends Omit<SelectRootProps<T, false>, 'items' | 'onValueChange' | 'children'> {
  placeholder?: string;
  items: SelectItems | GroupedSelectItems;
  noOptionsMessage?: string;
  onChange?: (value: T | undefined) => void;
}

export default function Select<T extends string | number>({
  items,
  placeholder,
  noOptionsMessage = 'No options',
  disabled,
  onChange,
  ...props
}: SelectProps<T>) {
  const isGrouped = Array.isArray(items) && items.length > 0 && 'items' in items[0];
  const flatItems: SelectItem[] = isGrouped
    ? ((items as GroupedSelectItems)?.flatMap((i) => i.items ?? []) ?? [])
    : ((items as SelectItems) ?? []);

  return (
    <BSelect.Root<T, false>
      {...props}
      items={flatItems}
      onValueChange={(value) => {
        onChange?.(value ?? undefined);
      }}
      multiple={false}
      disabled={disabled}
    >
      <BSelect.Trigger className={styles.Select} disabled={disabled}>
        <BSelect.Value className={styles.Value} placeholder={placeholder} />
        <BSelect.Icon className={styles.SelectIcon}>
          <IconSelector />
        </BSelect.Icon>
      </BSelect.Trigger>

      <BSelect.Portal>
        <BSelect.Positioner className={styles.Positioner}>
          <BSelect.Popup className={styles.Popup}>
            <BSelect.List className={styles.List}>
              {isGrouped ? (
                <GroupedItems items={items as GroupedSelectItem[]} noOptionsMessage={noOptionsMessage} />
              ) : (
                <Items items={items as SelectItem[]} noOptionsMessage={noOptionsMessage} />
              )}
            </BSelect.List>
          </BSelect.Popup>
        </BSelect.Positioner>
      </BSelect.Portal>
    </BSelect.Root>
  );
}

interface GroupedItemsProps {
  items?: GroupedSelectItem[];
  noOptionsMessage?: string;
}
function GroupedItems({ items, noOptionsMessage }: GroupedItemsProps) {
  return (
    <>
      {items
        ?.filter(
          (
            g,
          ): g is {
            label: string;
            items: SelectItem[];
          } => g.items != undefined,
        )
        .map(({ label, items: groupItems }) => (
          <BSelect.Group key={label} className={styles.Group}>
            <BSelect.GroupLabel className={styles.GroupLabel}>{label}</BSelect.GroupLabel>
            <Items items={groupItems} noOptionsMessage={noOptionsMessage} />
          </BSelect.Group>
        ))}
    </>
  );
}

interface ItemsProps {
  items?: SelectItem[];
  noOptionsMessage?: string;
}
function Items({ items, noOptionsMessage }: ItemsProps) {
  return (
    <>
      {items?.map(({ label, value }) => (
        <BSelect.Item key={value} value={value} className={styles.Item}>
          <BSelect.ItemIndicator className={styles.ItemIndicator}>
            <IconCheck className={styles.ItemIndicatorIcon} />
          </BSelect.ItemIndicator>

          <BSelect.ItemText className={styles.ItemText}>{label}</BSelect.ItemText>
        </BSelect.Item>
      ))}
      {!items?.length && (
        <div className={styles.EmptyMessage}>
          <span>{noOptionsMessage}</span>
        </div>
      )}
    </>
  );
}
