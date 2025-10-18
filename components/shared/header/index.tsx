import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import Menu from './menu';

function Header() {
  return (
    <header className="w-full border-b ">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Image
              src="/EmartLogo.png"
              alt={`${APP_NAME}`}
              height={48}
              width={48}
              priority={true}
            />
          </Link>
        </div>
        <Menu />
      </div>
    </header>
  );
}

export default Header;
