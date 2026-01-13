import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
// import Menu from './menu';
import MenuWrapper from './menu-wrapper';
import CategoryDrawer from './category-drawer';
import Search from './search';

function Header() {
  return (
    <header className="w-full border-b ">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <CategoryDrawer />
          <Link href="/" className="flex-start ml-4">
            <Image
              src="/EmartLogo.png"
              alt={`${APP_NAME}`}
              height={48}
              width={48}
              priority={true}
            />
          </Link>
        </div>
        <div className="hidden md:block">
          <Search />
        </div>
        <MenuWrapper />
      </div>
    </header>
  );
}

export default Header;
