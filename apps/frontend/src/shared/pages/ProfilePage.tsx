import { useAppSelector } from '../store/store';
import { EmployerProfilePage } from '../../modules/employer/pages/EmployerProfilePage';
import { ProfilePage as ProfilePageSimple } from '../../modules/jobSeeker/pages/ProfilePage';

export function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return null;
  }

  if (user.role === 'job_seeker') {
    return <ProfilePageSimple />;
  }

  if (user.role === 'employer') {
    return <EmployerProfilePage />;
  }

  return null;
}
