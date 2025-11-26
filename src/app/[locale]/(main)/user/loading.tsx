import { Card } from '@/components/atoms';
import { Spinner } from '@/components/atoms/Spinner/Spinner';
import { UserPageSkeleton } from '@/components/molecules/UserNavigation/UserNavigationSkeleton';

export default function UserLoading() {
  return (
    <UserPageSkeleton/>
  );
}
