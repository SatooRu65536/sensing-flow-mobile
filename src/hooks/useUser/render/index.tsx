export interface AlertProps {
  redirectToLogin: () => void;
  closeAlert: () => void;
}

export { AuthErrorAlert } from './AuthError';
export { NotLoggedInAlert } from './NotLoggedIn';
export { RefreshFailedAlert } from './RefreshFailed';
export { NotRegisteredAlert } from './NotRegistered';
