import { Link } from '@tanstack/react-router';
import styles from './index.module.scss';
import { IconActivity, IconFiles, IconPlayerPlay, IconClockEdit, IconSettings } from '@tabler/icons-react';

export enum TabSelect {
  Sensors = 'sensors',
  Files = 'files',
  Sensing = 'sensing',
  Logging = 'logging',
  Settings = 'settings',
}

interface Props {
  select?: TabSelect;
}

export default function TabBar({ select }: Props) {
  return (
    <div className={styles.tab_bar}>
      <Link to="/" data-selected={select === TabSelect.Sensors}>
        <IconActivity />
      </Link>

      <Link to="/files" data-selected={select === TabSelect.Files}>
        <IconFiles />
      </Link>

      <Link to="/sensing" className={styles.sensing} data-selected={select === TabSelect.Sensing}>
        <IconPlayerPlay />
      </Link>

      <Link to="/logging" data-selected={select === TabSelect.Logging}>
        <IconClockEdit />
      </Link>

      <Link to="/settings" data-selected={select === TabSelect.Settings}>
        <IconSettings />
      </Link>
    </div>
  );
}
