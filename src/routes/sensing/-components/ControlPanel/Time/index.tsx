import styles from './index.module.scss';
import { useEffect, useRef, useImperativeHandle } from 'react';
import classnames from 'classnames';
import { Store } from '@tanstack/store';
import { useStore } from '@tanstack/react-store';

const timerStore = new Store({
  elapsedTime: 0,
  isRunning: false,
  startTime: 0,
});

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
  const { elapsedTime, isRunning } = useStore(timerStore);
  const timerIdRef = useRef<number | null>(null);

  const start = () => {
    if (timerStore.state.isRunning) return;

    const now = Date.now();
    timerStore.setState((prev) => ({
      ...prev,
      isRunning: true,
      startTime: now - prev.elapsedTime,
    }));
  };

  const pause = () => {
    timerStore.setState((prev) => ({ ...prev, isRunning: false }));
    if (timerIdRef.current) clearInterval(timerIdRef.current);
  };

  const reset = () => {
    pause();
    timerStore.setState({ elapsedTime: 0, isRunning: false, startTime: 0 });
  };

  useEffect(() => {
    if (isRunning) {
      timerIdRef.current = window.setInterval(() => {
        timerStore.setState((prev) => ({
          ...prev,
          elapsedTime: Date.now() - prev.startTime,
        }));
      }, 100);
    }

    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
    };
  }, [isRunning]);

  useImperativeHandle(ref, () => ({
    start,
    pause,
    reset,
    getTime: () => timerStore.state.elapsedTime,
  }));

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  };

  return <div className={classnames(styles.timer, className)}>{formatTime(elapsedTime)}</div>;
}
