import SignInSection from './SignInSection';
import RegisterUserSection from './RegisterUserSection';
import UserProfileSection from './UserProfileSection';
import { useUser } from '@/hooks/useUser';

export default function UserSettings() {
  const { userProfile, isSignedIn } = useUser({ requireRegisteredUser: false });

  // サインイン前
  if (!isSignedIn) return <SignInSection />;
  // ユーザー登録前
  if (!userProfile.isSuccess) return <RegisterUserSection />;
  // ログイン済み
  return <UserProfileSection userProfile={userProfile.data} />;
}
