import styles from './index.module.scss';
import { AlertDialog as BAlertDialog, type AlertDialogRootProps } from '@base-ui/react/alert-dialog';
import type { BaseUIEvent } from 'node_modules/@base-ui/react/esm/utils/types';
import { useState, type ReactElement, type ReactNode } from 'react';
import classnames from 'classnames';

interface AlertDialogProps extends Omit<AlertDialogRootProps, 'children'> {
  title: string;
  trigger: ReactElement;
  triggerClassName?: string;
  children: ReactNode;
  cancelText?: string;
  confirmText?: string;
  danger?: boolean;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function AlertDialog({
  title,
  trigger,
  triggerClassName,
  children,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  danger = false,
  onConfirm,
  onCancel,
  isLoading = false,
  ...props
}: AlertDialogProps) {
  const [open, setOpen] = useState(props.open ?? false);

  const handleConfirm = async (event: BaseUIEvent<React.MouseEvent<HTMLButtonElement, MouseEvent>>) => {
    if (!onConfirm) return;
    event.preventDefault();

    try {
      await onConfirm();
      setOpen(false);
    } catch {
      setOpen(true);
    }
  };

  return (
    <BAlertDialog.Root open={open} onOpenChange={setOpen} {...props}>
      <BAlertDialog.Trigger className={classnames(styles.Trigger, triggerClassName)}>{trigger}</BAlertDialog.Trigger>

      <BAlertDialog.Portal>
        <BAlertDialog.Backdrop className={styles.Backdrop} />

        <BAlertDialog.Popup className={styles.Popup}>
          <BAlertDialog.Title className={styles.Title}>{title}</BAlertDialog.Title>

          <div className={styles.Content}>{children}</div>

          <div className={styles.Actions}>
            <BAlertDialog.Close className={styles.Cancel} disabled={isLoading} onClick={onCancel}>
              {cancelText}
            </BAlertDialog.Close>
            <BAlertDialog.Close
              className={styles.Confirm}
              disabled={isLoading}
              onClick={(e) => {
                void handleConfirm(e);
              }}
              data-danger={danger}
            >
              {confirmText}
            </BAlertDialog.Close>
          </div>
        </BAlertDialog.Popup>
      </BAlertDialog.Portal>
    </BAlertDialog.Root>
  );
}
