import { Store } from '@tanstack/store';
import { z } from 'zod';
import { sensingSettingsStore } from './sensing-settings';

export const sensingSettingsSchema = z.object({
  sensor: z.number().or(z.string().min(1, 'センサーを選択してください')),
  groupId: z.number().int().positive('グループを選択してください'),
  dataName: z.string().min(1, 'データ名を入力してください'),
  autoSync: z.boolean(),
  realTimeShare: z.boolean(),
});
export type SensingSettingsSchema = z.infer<typeof sensingSettingsSchema>;

interface ValidationStateError {
  isValid: false;
  errors: Record<string, string[]>;
}
interface ValidationStateOk {
  isValid: true;
  data: SensingSettingsSchema;
}
export type ValidationState = ValidationStateError | ValidationStateOk;

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
      data: result.data,
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
sensingSettingsStore.subscribe(() => {
  validateSettings();
});
validateSettings();
