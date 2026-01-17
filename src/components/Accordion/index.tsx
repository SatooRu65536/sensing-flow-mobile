import styles from './index.module.scss';
import { Accordion as BAccordion, type AccordionRootProps } from '@base-ui/react/accordion';
import { IconChevronUp } from '@tabler/icons-react';
import type { ReactElement, ReactNode } from 'react';
import classnames from 'classnames';
import { motion, useAnimation, type PanInfo } from 'framer-motion';

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
  delete?: ReactElement;
}
export function AccordionItem({ header, children, delete: deleteElement }: AccordionItemProps) {
  const controls = useAnimation();
  const deleteButtonWidth = 60;

  const onDragEnd = async (info: PanInfo) => {
    // 左へ一定以上スワイプされたら削除位置に固定、そうでなければ戻す
    if (info.offset.x < -deleteButtonWidth / 2) {
      await controls.start({ x: -deleteButtonWidth });
    } else {
      await controls.start({ x: 0 });
    }
  };

  const resetPosition = () => {
    void controls.start({ x: 0 });
  };

  return (
    <BAccordion.Item className={styles.Item}>
      <div className={styles.HeaderWrapper}>
        <div className={styles.DeleteAction}>{deleteElement}</div>

        <motion.div
          drag={deleteElement ? 'x' : false} // 削除機能がある場合のみドラッグ可能にする
          dragConstraints={{ left: -deleteButtonWidth, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(_, info) => void onDragEnd(info)}
          animate={controls}
          className={styles.HeaderMotion}
        >
          <BAccordion.Header className={styles.Header} onClick={resetPosition}>
            <div className={styles.HeaderContent}>{header}</div>
            <BAccordion.Trigger className={styles.Trigger}>
              <IconChevronUp className={styles.TriggerIcon} />
            </BAccordion.Trigger>
          </BAccordion.Header>
        </motion.div>
      </div>

      <BAccordion.Panel className={styles.Panel}>{children}</BAccordion.Panel>
    </BAccordion.Item>
  );
}
