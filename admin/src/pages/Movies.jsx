import { PencilIcon, TrashIcon } from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import { PlusIcon } from '@heroicons/react/outline'
import { UnixToTime, TimeToUnix } from '../utils/timeConvert'
import { toast } from 'sonner'
import axios from 'axios'

const movieInitial = {
  title: '',
  genres: [],
  releaseDate: 0,
  duration: 0,
  director: '',
  cast: [],
  trailer: '',
  cens: '',
  rating: 0,
  rating_count: 0,
  description: '',
  poster: '',
  origin: '',
}

export const Movie = () => {
  const [movies, setMovies] = useState([])
  const [editingMovie, setEditingMovie] = useState(movieInitial)
  const [peopleSearchQuery, setPeopleSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [addPeople, setAddPeople] = useState('director')
  const [reRender, setReRender] = useState(0)

  useEffect(() => {
    axios.get('http://localhost:5000/api/movie/all').then((res) => {
      setMovies(res.data.data)
    })
  }, [reRender])

  const handleEdit = (movie) => {
    setEditingMovie(movie)
    document.getElementById('movie_modal').showModal()
  }
  const handleCreateNew = () => {
    setEditingMovie(movieInitial)
    document.getElementById('movie_modal').showModal()
  }
  const handleSave = async () => {
    let movieData = { ...editingMovie }
    movieData.cast = movieData.cast.map((actor) => actor._id)
    movieData.director = movieData.director._id
    if (!movieData._id) {
      await axios
        .post('http://localhost:5000/api/movie/create', movieData)
        .then((res) => {
          toast.success(res.data.message)
          setReRender(reRender + 1)
        })
        .catch((err) => {
          toast.error(err.response.data.message)
        })
    } else {
      await axios
        .put('http://localhost:5000/api/movie/update', movieData)
        .then((res) => {
          toast.success(res.data.message)
          setReRender(reRender + 1)
        })
        .catch((err) => {
          toast.error(err.response.data.message)
        })
    }
  }
  const handleAddPeople = (type) => {
    setAddPeople(type)
    document.getElementById('people_modal').showModal()
  }
  const handleSaveAddPeople = (person) => {
    if (addPeople === 'director') {
      setEditingMovie({
        ...editingMovie,
        director: person,
      })
    } else {
      setEditingMovie({
        ...editingMovie,
        cast: [...editingMovie.cast, person],
      })
    }
    document.getElementById('people_modal').close()
  }
  const handleDeletePeople = (person, type) => {
    if (type === 'director') {
      console.log('delete director')
      setEditingMovie({
        ...editingMovie,
        director: '',
      })
    } else {
      setEditingMovie({
        ...editingMovie,
        cast: editingMovie.cast.filter((actor) => actor._id !== person._id),
      })
    }
  }
  useEffect(() => {
    if (!peopleSearchQuery) {
      setSearchResult([])
      return
    }
    axios
      .get(
        `http://localhost:5000/api/people/search?keyword=${peopleSearchQuery}&page=1&pageSize=10`
      )
      .then((res) => {
        setSearchResult(res.data.data.people)
      })
  }, [peopleSearchQuery])

  // const handleSaveEdit = () => {
  //   let movieData = { ...editingMovie }
  //   movieData.cast = movieData.cast.map((actor) => actor._id)
  //   movieData.director = movieData.director._id
  //   axios
  //     .put('http://localhost:5000/api/movie/update', movieData)
  //     .then((res) => {
  //       toast.success(res.data.message)
  //       setReRender(reRender + 1)
  //     })
  //     .catch((err) => {
  //       toast.error(err.response.data.message)
  //     })
  // }
  return (
    <div>
      <div className='card p-6 m-4 bg-base-100 rounded-lg overflow-hidden'>
        <div className='text-xl font-semibold inline-block'>
          Phim
          <div className='inline-block float-right'>
            <button
              onClick={() => handleCreateNew()}
              className='btn px-6 btn-sm normal-case btn-primary'
            >
              Thêm mới
            </button>
          </div>
        </div>
        <div className='divider mt-2'></div>

        <div className='overflow-x-auto'>
          <table className='table'>
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Tên phim</th>
                <th>Thể loại</th>
                <th>Ngày phát hành</th>
                <th>Tuỳ chọn</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie, index) => (
                <tr key={movie._id}>
                  <th>
                    <label>
                      <input type='checkbox' className='checkbox' />
                    </label>
                  </th>
                  <td>
                    <div className='flex items-center gap-3'>
                      <div className='font-bold'>{movie?.title}</div>
                    </div>
                  </td>
                  <td>
                    <div className='flex items-center gap-3'>
                      <div>{movie?.genres?.join(', ')}</div>
                    </div>
                  </td>
                  <td>
                    <div className='flex items-center gap-3'>
                      <div>{UnixToTime(movie?.releaseDate)}</div>
                    </div>
                  </td>
                  <th>
                    <button
                      className='btn btn-ghost btn-xs'
                      onClick={() => handleEdit(movie)}
                    >
                      <PencilIcon className='w-6 h-6 p-1' />
                    </button>
                    <button className='btn btn-ghost btn-xs'>
                      <TrashIcon className='w-6 h-6 p-1' />
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <dialog id='movie_modal' className='modal w-100'>
          <div className='modal-box w-11/12 max-w-3xl'>
            <form method='dialog'>
              <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
                ✕
              </button>
            </form>
            <div className='flex flex-row gap-5'>
              <div className='mt-10 flex flex-col items-center gap-5 w-72'>
                <img
                  className='rounded-lg object-contain w-72'
                  src={editingMovie?.poster}
                  alt='poster'
                />
                {!editingMovie?.poster && (
                  <label className='form-control w-full max-w-xs'>
                    <div className='label'>
                      <span className='label-text'>Link ảnh</span>
                    </div>
                    <input
                      type='text'
                      value={editingMovie?.poster}
                      onChange={(e) =>
                        setEditingMovie({
                          ...editingMovie,
                          poster: e.target.value,
                        })
                      }
                      className='input input-bordered w-full max-w-xs'
                    />
                  </label>
                )}
                <button className='btn btn-primary'>Chọn ảnh</button>
              </div>
              <div className='flex flex-col w-full'>
                <div className='flex flex-row gap-2'>
                  <label className='form-control w-full max-w-xs'>
                    <div className='label'>
                      <span className='label-text'>Tên phim</span>
                    </div>
                    <input
                      type='text'
                      value={editingMovie?.title}
                      onChange={(e) =>
                        setEditingMovie({
                          ...editingMovie,
                          title: e.target.value,
                        })
                      }
                      className='input input-bordered w-full max-w-xs'
                    />
                  </label>

                  <label className='form-control w-full max-w-xs'>
                    <div className='label'>
                      <span className='label-text'>Ngày phát hành</span>
                    </div>
                    <input
                      type='date'
                      value={UnixToTime(editingMovie?.releaseDate)}
                      onChange={(e) =>
                        setEditingMovie({
                          ...editingMovie,
                          releaseDate: TimeToUnix(e.target.value),
                        })
                      }
                      className='rounded w-full p-3 focus:outline-none bg-transparent border border-[#a6adbb33]'
                    />
                  </label>
                </div>

                <div className='flex flex-row gap-2'>
                  <label className='form-control'>
                    <div className='label'>
                      <span className='label-text w-28'>Thời lượng (phút)</span>
                    </div>
                    <input
                      type='number'
                      value={editingMovie?.duration}
                      onChange={(e) =>
                        setEditingMovie({
                          ...editingMovie,
                          duration: e.target.value,
                        })
                      }
                      className='input input-bordered w-full'
                    />
                  </label>

                  <label className='form-control w-full'>
                    <div className='label'>
                      <span className='label-text'>Thể loại</span>
                    </div>
                    <input
                      type='text'
                      value={editingMovie?.genres.join(', ')}
                      onChange={(e) =>
                        setEditingMovie({
                          ...editingMovie,
                          genres: e.target.value.split(', '),
                        })
                      }
                      className='input input-bordered'
                    />
                  </label>
                </div>

                <div className='flex flex-row gap-2'>
                  <div className='form-control w-full'>
                    <div className='label'>
                      <span className='label-text'>Đạo diễn</span>
                    </div>
                    <div className='flex flex-row gap-2'>
                      <div
                        className='tooltip h-10 w-10'
                        data-tip={editingMovie?.director?.name}
                      >
                        <button
                          onClick={() =>
                            handleDeletePeople(
                              editingMovie?.director,
                              'director'
                            )
                          }
                          className='absolute btn btn-xs btn-circle btn-ghost -right-2 -top-2'
                        >
                          ✕
                        </button>
                        <img
                          src={editingMovie?.director?.photo}
                          className='rounded-full h-10 w-10 object-cover'
                          title={editingMovie?.director?.name}
                        />
                      </div>
                      <button
                        onClick={() => handleAddPeople('director')}
                        className='rounded-full w-10 h-10 flex justify-center items-center'
                      >
                        <PlusIcon className='w-5 h-5' />
                      </button>
                    </div>
                  </div>

                  <div className='form-control w-full'>
                    <div className='label'>
                      <span className='label-text'>Diễn viên</span>
                    </div>
                    <div className='flex flex-row gap-2'>
                      {editingMovie?.cast.map((actor) => (
                        <div
                          key={actor._id}
                          className='tooltip h-10 w-10'
                          data-tip={actor?.name}
                        >
                          <button
                            className='absolute btn btn-xs btn-circle btn-ghost -right-2 -top-2'
                            onClick={() => handleDeletePeople(actor, 'actor')}
                          >
                            ✕
                          </button>
                          <img
                            src={actor.photo}
                            className='rounded-full h-10 w-10 object-cover'
                          />
                        </div>
                      ))}

                      <button
                        onClick={() => handleAddPeople('actor')}
                        className='rounded-full w-10 h-10 flex justify-center items-center'
                      >
                        <PlusIcon className='w-5 h-5' />
                      </button>
                    </div>
                  </div>
                </div>

                <label className='form-control'>
                  <div className='label'>
                    <span className='label-text w-50'>
                      Trailer (Link video)
                    </span>
                  </div>
                  <input
                    type='text'
                    value={editingMovie?.trailer}
                    onChange={(e) =>
                      setEditingMovie({
                        ...editingMovie,
                        trailer: e.target.value,
                      })
                    }
                    className='input input-bordered w-full'
                  />
                </label>

                <div className='flex flex-row gap-2'>
                  <label className='form-control w-full'>
                    <div className='label'>
                      <span className='label-text w-full'>
                        Xếp hạng kiểm duyệt
                      </span>
                    </div>
                    <input
                      type='text'
                      placeholder='T16, K,...'
                      value={editingMovie?.cens}
                      onChange={(e) =>
                        setEditingMovie({
                          ...editingMovie,
                          cens: e.target.value,
                        })
                      }
                      className='input input-bordered w-full'
                    />
                  </label>

                  <label className='form-control w-28'>
                    <div className='label'>
                      <span className='label-text'>Đánh giá (sao)</span>
                    </div>
                    <input
                      type='number'
                      value={editingMovie?.rating}
                      onChange={(e) =>
                        setEditingMovie({
                          ...editingMovie,
                          rating: e.target.value,
                        })
                      }
                      className='input input-bordered'
                    />
                  </label>

                  <label className='form-control w-32'>
                    <div className='label'>
                      <span className='label-text'>Số lượng đánh giá</span>
                    </div>
                    <input
                      type='text'
                      value={editingMovie?.rating_count}
                      onChange={(e) =>
                        setEditingMovie({
                          ...editingMovie,
                          rating_count: e.target.value,
                        })
                      }
                      className='input input-bordered'
                    />
                  </label>
                  <label className='form-control w-20 '>
                    <div className='label'>
                      <span className='label-text'>Quốc gia</span>
                    </div>
                    <input
                      type='text'
                      value={editingMovie?.origin}
                      className='input input-bordered'
                    />
                  </label>
                </div>
              </div>
            </div>
            <label className='form-control'>
              <div className='label'>
                <span className='label-text'>Mô tả</span>
              </div>
              <textarea
                className='textarea textarea-bordered h-24'
                value={editingMovie?.description}
              ></textarea>
            </label>
            <div className='flex justify-end mt-5'>
              <button onClick={() => handleSave()} className='btn btn-primary'>
                Lưu
              </button>
            </div>
          </div>
        </dialog>
      </div>

      {/* Modal thêm đạo diễn/Diễn viên */}
      <dialog id='people_modal' className='modal'>
        <div className='modal-box'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>
          {/* Ô nhập tên */}
          <label className='form-control w-full'>
            <span className='label label-text'>Tên</span>
            <input
              type='text'
              value={peopleSearchQuery}
              onChange={(e) => setPeopleSearchQuery(e.target.value)}
              className='input input-bordered w-full'
            />
          </label>
          {/* Hiển thị kết quả tìm kiếm */}
          <div className='z-10 flex flex-col items-start'>
            {searchResult.map((person) => (
              <button
                onClick={() => handleSaveAddPeople(person)}
                className='pt-2 ml-2'
              >
                {person?.name}
              </button>
            ))}
          </div>
          <div className='flex justify-end mt-5'>
            <button className='btn btn-primary'>Lưu</button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
