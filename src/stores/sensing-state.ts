import { Store } from '@tanstack/store';

export const StateEnum = {
  READY: 'ready',
  RUNNING: 'running',
  PAUSED: 'paused',
} as const;
export type State = (typeof StateEnum)[keyof typeof StateEnum];

export const sensingStateStore = new Store<State>(StateEnum.READY);

export function setState(newState: State) {
  sensingStateStore.setState(newState);
}
