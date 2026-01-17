import styles from './index.module.scss';
import { Accordion as BAccordion, type AccordionRootProps } from '@base-ui/react/accordion';
import { IconChevronDown } from '@tabler/icons-react';
import type { ReactElement, ReactNode } from 'react';
import classnames from 'classnames';

interface AccordionProps extends AccordionRootProps {
  children: ReactNode;
}

export function AccordionRoot({ children, className, ...props }: AccordionProps) {
  return (
    <BAccordion.Root className={classnames(styles.Accordion, className)} {...props}>
      {children}
    </BAccordion.Root>
  );
}

interface AccordionItemProps {
  header: ReactElement;
  children: ReactNode;
}
export function AccordionItem({ header, children }: AccordionItemProps) {
  return (
    <BAccordion.Item className={styles.Item}>
      <BAccordion.Header className={styles.Header}>
        <BAccordion.Trigger className={styles.Trigger}>
          {header}
          <IconChevronDown className={styles.TriggerIcon} />
        </BAccordion.Trigger>
      </BAccordion.Header>

      <BAccordion.Panel className={styles.Panel}>{children}</BAccordion.Panel>
    </BAccordion.Item>
  );
}
