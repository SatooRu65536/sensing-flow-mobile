import { Store } from '@tanstack/store';
import { z } from 'zod';

export interface SensingSettingsState {
  sensor?: string;
  groupId?: number;
  dataName: string;
  autoSync: boolean;
  realTimeShare: boolean;
}

export interface ValidationState {
  isValid: boolean;
  errors: Record<string, string[]>;
}

// Zodスキーマ定義
export const sensingSettingsSchema = z.object({
  sensor: z.string().min(1, 'センサーを選択してください').optional(),
  groupId: z.number().int().positive('グループを選択してください').optional(),
  dataName: z.string().min(1, 'データ名を入力してください'),
  autoSync: z.boolean(),
  realTimeShare: z.boolean(),
});

export const sensingSettingsStore = new Store<SensingSettingsState>({
  sensor: undefined,
  groupId: undefined,
  dataName: '',
  autoSync: false,
  realTimeShare: false,
});

export const valiedSensingSettings = new Store<ValidationState>({
  isValid: false,
  errors: {},
});

const validateSettings = () => {
  const state = sensingSettingsStore.state;
  const result = sensingSettingsSchema.safeParse(state);

  if (result.success) {
    valiedSensingSettings.setState({
      isValid: true,
      errors: {},
    });
  } else {
    const errors: Record<string, string[]> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.');
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(issue.message);
    });

    valiedSensingSettings.setState({
      isValid: false,
      errors,
    });
  }
};

// storeの変更を監視してバリデーションを実行
sensingSettingsStore.subscribe(() => {
  validateSettings();
});

// 初回バリデーション実行
validateSettings();

export const setSensor = (sensor: string | undefined) => {
  sensingSettingsStore.setState((state) => ({
    ...state,
    sensor,
  }));
};

export const setGroupId = (groupId: number | undefined) => {
  sensingSettingsStore.setState((state) => ({
    ...state,
    groupId,
  }));
};

export const setDataName = (dataName: string) => {
  sensingSettingsStore.setState((state) => ({
    ...state,
    dataName,
  }));
};

export const setAutoSync = (autoSync: boolean) => {
  sensingSettingsStore.setState((state) => ({
    ...state,
    autoSync,
  }));
};

export const setRealTimeShare = (realTimeShare: boolean) => {
  sensingSettingsStore.setState((state) => ({
    ...state,
    realTimeShare,
  }));
};

export const resetSensingSettings = () => {
  sensingSettingsStore.setState({
    sensor: undefined,
    groupId: undefined,
    dataName: '',
    autoSync: false,
    realTimeShare: false,
  });
};
