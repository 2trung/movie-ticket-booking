import express from 'express'
import moment from 'moment'
import { orderModel } from '~/models/orderModel'

import { orderValidation } from '~/validations/orderValidation'
import { orderController } from '~/controllers/orderController'
const Router = express.Router()

Router.post('/create_payment_url', async (req, res) => {
  process.env.TZ = 'Asia/Ho_Chi_Minh'

  let date = new Date()
  let createDate = moment(date).format('YYYYMMDDHHmmss')

  let ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress

  let tmnCode = 'JUOYUPBK'
  let secretKey = 'GVBXSRJVJPKTVAZXIRTFHCLEPEUPICIZ'
  let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
  let returnUrl = 'http://192.168.2.240:5000/api/order/vnpay-return'
  // let orderId = moment(date).format('DDHHmmss')
  let orderId = req.body.orderId
  const orderDetail = await orderModel.getById(orderId)
  let amount = orderDetail.total
  let bankCode = req.body.bankCode || ''
  let locale = 'vn'
  let currCode = 'VND'

  let vnp_Params = {}
  vnp_Params['vnp_Version'] = '2.1.0'
  vnp_Params['vnp_Command'] = 'pay'
  vnp_Params['vnp_TmnCode'] = tmnCode
  vnp_Params['vnp_Locale'] = locale
  vnp_Params['vnp_CurrCode'] = currCode
  vnp_Params['vnp_TxnRef'] = orderId
  vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId
  vnp_Params['vnp_OrderType'] = 'other'
  vnp_Params['vnp_Amount'] = amount * 100
  vnp_Params['vnp_ReturnUrl'] = returnUrl
  vnp_Params['vnp_IpAddr'] = ipAddr
  vnp_Params['vnp_CreateDate'] = createDate
  vnp_Params['vnp_BankCode'] = bankCode

  vnp_Params = sortObject(vnp_Params)

  let querystring = require('qs')
  let signData = querystring.stringify(vnp_Params, { encode: false })
  let crypto = require('crypto')
  let hmac = crypto.createHmac('sha512', secretKey)
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')
  vnp_Params['vnp_SecureHash'] = signed
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false })

  res.status(200).json({ data: vnpUrl })
})

// Router.get('/return', async (req, res, next) => {
//   let vnp_Params = req.query

//   let secureHash = vnp_Params['vnp_SecureHash']
//   let orderId = vnp_Params['vnp_TxnRef']
//   let bankCode = vnp_Params['vnp_BankCode']

//   delete vnp_Params['vnp_SecureHash']
//   delete vnp_Params['vnp_SecureHashType']

//   vnp_Params = sortObject(vnp_Params)

//   let tmnCode = 'JUOYUPBK'
//   let secretKey = 'GVBXSRJVJPKTVAZXIRTFHCLEPEUPICIZ'
//   console.log(vnp_Params)
//   let querystring = require('qs')
//   let signData = querystring.stringify(vnp_Params, { encode: false })
//   let crypto = require('crypto')
//   let hmac = crypto.createHmac('sha512', secretKey)
//   let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')
//   console.log(signData)

//   if (secureHash === signed) {
//     res.status(200).send(`
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Trạng thái đơn hàng</title>
//         <style>
//             body {
//                 font-family: Arial, sans-serif;
//                 background-color: #f2f2f2;
//                 margin: 0;
//                 padding: 0;
//                 display: flex;
//                 justify-content: center;
//                 align-items: center;
//                 height: 100vh;
//             }
//             .success-box {
//                 background-color: #d4edda;
//                 color: #155724;
//                 border: 1px solid #c3e6cb;
//                 padding: 20px;
//                 border-radius: 5px;
//                 box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//                 text-align: center;
//             }
//         </style>
//     </head>
//     <body>
//         <div class="success-box">
//             <h2>Thanh toán thành công!</h2>
//             <p>Đóng tab này để tiếp tục </p>
//         </div>
//     </body>
//     </html>
//     `)
//     req.body = {
//       orderId: '6612aa74fb050e4d96752731',
//       paymentMethod: bankCode,
//       status: 'success',
//     }
//   } else {
//     res.status(200).send(`
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Trạng thái đơn hàng</title>
//         <style>
//             body {
//                 font-family: Arial, sans-serif;
//                 background-color: #f2f2f2;
//                 margin: 0;
//                 padding: 0;
//                 display: flex;
//                 justify-content: center;
//                 align-items: center;
//                 height: 100vh;
//             }
//               .error-box {
//                 background-color: #f8d7da;
//                 color: #721c24;
//                 border: 1px solid #f5c6cb;
//                 padding: 20px;
//                 border-radius: 5px;
//                 box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//                 text-align: center; /* Căn giữa văn bản */
//             }
//         </style>
//     </head>
//     <body>
//     <div class="error-box">
//       <h2>Thanh toán thất bại!</h2>
//       <p>Đóng tab này để tiếp tục</p>
//     </div>
//     </body>
//     </html>
//     `)
//   }
// })

function sortObject(obj) {
  let sorted = {}
  let str = []
  let key
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key))
    }
  }
  str.sort()
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+')
  }
  return sorted
}

export const vnpayRoute = Router
