import { useUserProfile } from '@/hooks/useUserProfile';
import SignInSection from './SignInSection';
import RegisterUserSection from './RegisterUserSection';
import UserProfileSection from './UserProfileSection';

export default function UserSettings() {
  const { userProfile, isLoggedIn } = useUserProfile({ from: '/settings/' });

  // サインイン前
  if (!isLoggedIn) return <SignInSection />;
  // ユーザー登録前
  if (!userProfile) return <RegisterUserSection />;
  // ログイン済み
  return <UserProfileSection userProfile={userProfile} />;
}
