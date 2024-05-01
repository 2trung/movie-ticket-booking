import {
  FilmIcon,
  UserIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  CogIcon,
} from '@heroicons/react/outline'
import { Router, Link } from 'react-router-dom'

export const Drawer = ({ content }) => {
  return (
    <div className='flex-row'>
      {/* Drawer */}
      <div className='drawer lg:drawer-open'>
        <input id='my-drawer-2' type='checkbox' className='drawer-toggle' />
        <div className='drawer-content flex flex-col '>
          {content}
          <label
            htmlFor='my-drawer-2'
            className='btn btn-primary drawer-button lg:hidden'
          >
            Open drawer
          </label>
        </div>
        <div className='flex drawer-side'>
          <label
            htmlFor='my-drawer-2'
            aria-label='close sidebar'
            className='drawer-overlay'
          ></label>
          <ul className='menu p-4 w-80 min-h-full bg-base-200 text-base-content'>
            <li>
              <Link to='/movie'>
                <FilmIcon className='w-6 h-6 mr-2' />
                Phim
              </Link>
            </li>
            <li>
              <Link to='/user'>
                <UserIcon className='w-6 h-6 mr-2' />
                Người dùng
              </Link>
            </li>
            <li>
              <Link to='/schedule'>
                <VideoCameraIcon className='w-6 h-6 mr-2' />
                Suất chiếu
              </Link>
            </li>
            <li>
              <Link to='/order'>
                <DocumentTextIcon className='w-6 h-6 mr-2' />
                Đơn đặt vé
              </Link>
            </li>
            <li>
              <details open>
                <summary>
                  <CogIcon className='w-6 h-6 mr-2' />
                  Khác
                </summary>
                <ul>
                  <li>
                    <Link to='/other/people'>Đạo diễn/diễn viên</Link>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
