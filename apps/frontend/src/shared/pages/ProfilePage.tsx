import { useAppSelector } from '../store/store';
import { ProfilePageComplete } from '../../modules/jobSeeker/pages/ProfilePageComplete';
import { EmployerProfilePage } from '../../modules/employer/pages/EmployerProfilePage';

export function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return null;
  }

  if (user.role === 'job_seeker') {
    return <ProfilePageComplete />;
  }

  if (user.role === 'employer') {
    return <EmployerProfilePage />;
  }

  return null;
}
