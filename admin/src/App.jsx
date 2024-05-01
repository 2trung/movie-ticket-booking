import { Routes, Route } from 'react-router-dom'

import { Navbar } from './components/Navbar'
import { Drawer } from './components/Drawer'

import { Movie, Schedule, Order, User, People } from './pages'

function App() {
  return (
    <div className=''>
      <Navbar />
      <Drawer
        content={
          <Routes>
            <Route path='/movie' element={<Movie />} />
            <Route path='/user' element={<User />} />
            <Route path='/schedule' element={<Schedule />} />
            <Route path='/order' element={<Order />} />
            <Route path='/other/people' element={<People />} />
          </Routes>
        }
      />
    </div>
  )
}

export default App
