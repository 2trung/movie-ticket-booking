import { scheduleModel } from '~/models/scheduleModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { roomModel } from '~/models/roomModel'
import { orderModel } from '~/models/orderModel'
import { movieModel } from '~/models/movieModel'
// import querystring from 'qs'
import crypto from 'crypto'
import { sortObject } from '~/utils/sortObject'

const TIME_TO_ORDER = 15 * 60 * 1000

const createOrder = async (user, schedule_id, seats) => {
  try {
    const schedule = await scheduleModel.getById(schedule_id)
    const movie = await movieModel.getById(schedule.movie_id)
    const room = await roomModel.getById(schedule.room_id)

    if (schedule.start_time < Date.now() + TIME_TO_ORDER) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Hết thời gian đặt vé')
    }

    if (seats.length === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Chưa chọn ghế')
    }

    let total = 0
    for (let seat of seats) {
      if (
        room.seats.includes(seat) === false ||
        schedule.reserved_seats.includes(seat)
      ) {
        console.log(room.seats)
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Ghế ${seat} không khả dụng`
        )
      }
      if (
        schedule.pending_seats.some((pending) => pending.seats.includes(seat))
      ) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Ghế ${seat} không khả dụng`
        )
      }
      total += schedule.price
    }
    const orderTime = Date.now()

    const order = {
      user_id: user._id,
      schedule_id: schedule_id,
      seats: seats,
      order_time: orderTime,
      status: 'pending',
      total: total,
    }

    const createdOrder = await orderModel.createOrder(order)
    const newSchedule = {
      ...schedule,
      pending_seats: [
        ...schedule.pending_seats,
        {
          seats: seats,
          order_id: createdOrder.insertedId,
          expTime: Date.now() + TIME_TO_ORDER,
        },
      ],
    }
    await scheduleModel.updateSchedule(schedule_id, newSchedule)

    return {
      message: 'Đặt vé thành công',
      data: {
        order_id: createdOrder.insertedId,
        schedule_id: schedule_id,
        start_time: schedule.start_time,
        room_number: room.room_number,
        movie_title: movie.title,
        movie_poster: movie.poster,
        movie_genres: movie.genres,
        movie_duration: movie.duration,
        cinema_name: room.cinema_name,
        cinema_location: room.cinema_location,
        selectedSeats: seats,
        total: total,
        order_time: orderTime,
        status: 'pending',
      },
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
}

const getOrderByUserId = async (reqUser) => {
  try {
    const user_id = reqUser._id
    const orders = await orderModel.getByUserId(user_id)
    const extendedOrder = []
    for (let order of orders.reverse()) {
      const schedule = await scheduleModel.getById(order.schedule_id)
      const movie = await movieModel.getById(schedule.movie_id)
      const expTime = new Date(order.order_time.getTime() + TIME_TO_ORDER)
      if (expTime < new Date() && order.status === 'pending') {
        await orderModel.updateOrder(order._id, { status: 'canceled' })
        const newSchedule = {
          ...schedule,
          pending_seats: schedule.pending_seats.filter(
            (pending) => String(pending.order_id) !== String(order._id)
          ),
        }
        await scheduleModel.updateSchedule(order.schedule_id, newSchedule)
        movie = await movieModel.getById(schedule.movie_id)
      }
      extendedOrder.push({
        order_id: order._id,
        order_time: order.order_time,
        movie_name: movie.title,
        movie_poster: movie.poster,
        total: order.total,
        status: order.status,
      })
    }
    return { message: 'Lấy thông tin đơn hàng thành công', data: extendedOrder }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
}
const getOrderDetail = async (reqUser, orderId) => {
  try {
    const order = await orderModel.getById(orderId)
    if (order === null) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy đơn hàng')
    }
    if (String(order.user_id) !== String(reqUser._id)) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Không có quyền truy cập')
    }
    return { message: 'Lấy trạng thái đơn hàng thành công', data: order }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
}
const getTicketsByUserId = async (reqUser) => {
  try {
    const user_id = reqUser._id
    const orders = await orderModel.getByUserId(user_id)
    const completedOrders = orders.filter((order) => order.status === 'success')

    const tickets = []
    for (let order of completedOrders.reverse()) {
      const schedule = await scheduleModel.getById(order.schedule_id)
      const room = await roomModel.getById(schedule.room_id)
      const movie = await movieModel.getById(schedule.movie_id)

      tickets.push({
        order_id: order._id,
        schedule_id: schedule._id,
        start_time: schedule.start_time,
        movie_name: movie.title,
        movie_poster: movie.poster,
        cinema_name: room.cinema_name,
        cinema_location: room.cinema_location,
      })
    }
    return { message: 'Lấy thông tin vé thành công', data: tickets }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
}

const getTicketDetail = async (orderId) => {
  try {
    const order = await orderModel.getById(orderId)
    if (order === null) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy đơn hàng')
    }
    const schedule = await scheduleModel.getById(order.schedule_id)
    const room = await roomModel.getById(schedule.room_id)
    const movie = await movieModel.getById(schedule.movie_id)
    return {
      message: 'Lấy thông tin vé thành công',
      data: {
        order_id: order._id,
        schedule_id: schedule._id,
        start_time: schedule.start_time,
        room_number: room.room_number,
        movie_title: movie.title,
        movie_poster: movie.poster,
        movie_genres: movie.genres,
        movie_duration: movie.duration,
        cinema_name: room.cinema_name,
        cinema_location: room.cinema_location,
        selectedSeats: order.seats,
        total: order.total,
        order_time: order.order_time,
        status: order.status,
      },
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
}

const cancelOrder = async (userId, orderId) => {
  try {
    const order = await orderModel.getById(orderId)
    if (order === null) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy đơn hàng')
    }
    if (String(order.user_id) !== String(userId)) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Không có quyền truy cập')
    }
    if (order.status === 'success') {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Đơn hàng đã được thanh toán')
    }
    await orderModel.updateOrder(orderId, { status: 'canceled' })
    const schedule = await scheduleModel.getById(order.schedule_id)
    const newSchedule = {
      ...schedule,
      pending_seats: schedule.pending_seats.filter(
        (pending) => String(pending.order_id) !== String(orderId)
      ),
    }
    await scheduleModel.updateSchedule(order.schedule_id, newSchedule)
    return { message: 'Hủy đơn hàng thành công', data: {} }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
}

const vnpReturn = async (reqQuery, signData) => {
  try {
    const orderId = reqQuery.vnp_TxnRef
    let parts = signData.split('&')
    parts.pop()
    signData = parts.join('&')
    const order = await orderModel.getById(orderId)
    if (order === null) {
      return 'Không tìm thấy đơn hàng'
    }
    // if (order.status === 'success') {
    //   return 'Đơn hàng đã thanh toán'
    // }
    const paymentMethod = reqQuery.vnp_CardType
    const responseCode = reqQuery.vnp_ResponseCode
    const secureHash = reqQuery.vnp_SecureHash
    delete reqQuery.vnp_SecureHash
    delete reqQuery.vnp_SecureHashType
    const secretKey = 'GVBXSRJVJPKTVAZXIRTFHCLEPEUPICIZ'
    reqQuery = sortObject(reqQuery)
    const hmac = crypto.createHmac('sha512', secretKey)
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')
    if (secureHash === signed && responseCode === '00') {
      await orderModel.updateOrder(orderId, {
        status: 'success',
        paymentMethod: paymentMethod,
      })
      const schedule = await scheduleModel.getById(order.schedule_id)
      const updatePendingSeats = schedule.pending_seats.filter(
        (order) => String(order.order_id) !== String(orderId)
      )
      await scheduleModel.updateSchedule(order.schedule_id, {
        ...schedule,
        reserved_seats: [...schedule.reserved_seats, ...order.seats],
        pending_seats: updatePendingSeats,
      })
      return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Trạng thái đơn hàng</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f2f2f2;
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
              }
              .success-box {
                  background-color: #d4edda;
                  color: #155724;
                  border: 1px solid #c3e6cb;
                  padding: 20px;
                  border-radius: 5px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <div class="success-box">
              <h2>Thanh toán thành công!</h2>
              <p>Đóng tab này để tiếp tục</p>
              <p id="countdown"></p>
          </div>
      
          <script>
              var count = 5;
              var countdownElement = document.getElementById('countdown');
              
              function countdown() {
                  countdownElement.innerHTML = "Tự đóng trong " + count + " giây";
                  count--;
                  if (count < 0) {
                      clearInterval(timer);
                      window.close();
                  }
              }
              var timer = setInterval(countdown, 1000);
              countdown();
          </script>
      </body>
      </html>
      
        `
    } else {
      await orderModel.updateOrder(orderId, {
        status: 'payment failed',
        paymentMethod: paymentMethod,
      })
      return `
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Trạng thái đơn hàng</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f2f2f2;
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
              }
                .error-box {
                  background-color: #f8d7da;
                  color: #721c24;
                  border: 1px solid #f5c6cb;
                  padding: 20px;
                  border-radius: 5px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  text-align: center; /* Căn giữa văn bản */
              }
          </style>
      </head>
      <body>
      <div class="error-box">
        <h2>Thanh toán thất bại!</h2>
        <p>Đóng tab này để tiếp tục</p>
      </div>
      </body>
      </html>
      `
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
}

export const orderService = {
  createOrder,
  vnpReturn,
  getOrderByUserId,
  getTicketsByUserId,
  getTicketDetail,
  getOrderDetail,
  cancelOrder,
}
