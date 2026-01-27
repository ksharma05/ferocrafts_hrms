import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (


<header class="bg-white dark:bg-gray-900">
  <nav aria-label="Global" class="flex items-center justify-between p-6 lg:px-8">
    <div class="flex lg:flex-1">
      <Link to='/'>
        <span class="sr-only">Your Company</span>
        <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="" class="h-8 w-auto dark:hidden" />
        <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="" class="h-8 w-auto not-dark:hidden" />
      </Link>
    </div>
    <div class="flex lg:hidden">
      <button type="button" command="show-modal" commandfor="mobile-menu" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-400">
        <span class="sr-only">Open main menu</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6">
          <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
    <div class="hidden lg:flex lg:gap-x-12">
      <a href="#" class="text-sm/6 font-semibold text-gray-900 dark:text-white">Product</a>
      <a href="#" class="text-sm/6 font-semibold text-gray-900 dark:text-white">Features</a>
      <a href="#" class="text-sm/6 font-semibold text-gray-900 dark:text-white">Marketplace</a>
      <a href="#" class="text-sm/6 font-semibold text-gray-900 dark:text-white">Company</a>
    </div>
    <ul class="hidden lg:flex lg:flex-1 lg:justify-end">
      

      <ul className="py-6">
                
                {user ? (
          <>
            {(user.role === 'admin' || user.role === 'manager') && (
              <li className="text-sm/6 font-semibold text-gray-900 dark:text-white cursor-pointer">
                <Link to='/employees'>Employees</Link>
              </li>
            )}
            <li className="text-sm/6 font-semibold text-gray-900 dark:text-white ">
              <button className='btn cursor-pointer' onClick={onLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="text-sm/6 font-semibold text-gray-900 dark:text-white cursor-pointer">
              <Link to='/login'>
                <FaSignInAlt /> Login
              </Link>
            </li>
          </>
        )}
              </ul>
    </ul>
  </nav>
  <el-dialog>
    <dialog id="mobile-menu" class="backdrop:bg-transparent lg:hidden">
      <div tabindex="0" class="fixed inset-0 focus:outline-none">
        <el-dialog-panel class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-gray-900 dark:sm:ring-gray-100/10">
          <div class="flex items-center justify-between">
            <a href="#" class="-m-1.5 p-1.5">
              <span class="sr-only">Your Company</span>
              <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="" class="h-8 w-auto dark:hidden" />
              <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="" class="h-8 w-auto not-dark:hidden" />
            </a>
            <button type="button" command="close" commandfor="mobile-menu" class="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-400">
              <span class="sr-only">Close menu</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6">
                <path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
          <div class="mt-6 flow-root">
            <div class="-my-6 divide-y divide-gray-500/10 dark:divide-white/10">
              <div class="space-y-2 py-6">
                <a href="#" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5">Product</a>
                <a href="#" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5">Features</a>
                <a href="#" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5">Marketplace</a>
                <a href="#" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5">Company</a>
              </div>
              <ul className="py-6">
                
                {user ? (
          <>
            {(user.role === 'admin' || user.role === 'manager') && (
              <li className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5 cursor-pointer">
                <Link to='/employees'>Employees</Link>
              </li>
            )}
            <li className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5 ">
              <button className='btn cursor-pointer' onClick={onLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5 cursor-pointer">
              <Link to='/login'>
                <FaSignInAlt /> Login
              </Link>
            </li>
          </>
        )}
              </ul>
            </div>
          </div>
        </el-dialog-panel>
      </div>
    </dialog>
  </el-dialog>
</header>







  );
}

export default Header;
