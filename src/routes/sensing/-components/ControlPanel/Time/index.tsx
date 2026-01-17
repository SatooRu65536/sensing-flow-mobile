import styles from './index.module.scss';
import { useRef, useImperativeHandle, useState } from 'react';
import classnames from 'classnames';

export interface TimerHandle {
  start: () => void;
  pause: () => void;
  reset: () => void;
  getTime: () => number;
}

interface TimerProps {
  ref: React.Ref<TimerHandle>;
  className?: string;
}

export default function Timer({ ref, className }: TimerProps) {
  const startTimeRef = useRef<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerIdRef = useRef<number | null>(null);

  const start = () => {
    if (timerIdRef.current) return;

    startTimeRef.current = Date.now() - elapsedTime;

    timerIdRef.current = window.setInterval(() => {
      setElapsedTime(Date.now() - (startTimeRef.current as number));
    }, 100);
  };

  const pause = () => {
    if (timerIdRef.current) {
      window.clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
  };

  const reset = () => {
    pause();
    setElapsedTime(0);
  };

  useImperativeHandle(ref, () => ({
    start,
    pause,
    reset,
    getTime: () => elapsedTime,
  }));

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return <div className={classnames(styles.timer, className)}>{formatTime(elapsedTime)}</div>;
}
