import { auth } from '@/lib/auth';
import Menu from './menu';

export default async function MenuWrapper() {
  const session = await auth();

  return (
    <>
      <Menu session={session} />
    </>
  );
}
