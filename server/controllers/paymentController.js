const axios = require('axios');
const Order = require('../models/Order');

const getAccessToken = async () => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting M-Pesa access token:', error.response ? error.response.data : error.message);
    throw new Error('Failed to get access token');
  }
};

const stkPush = async (req, res) => {
  try {
    const { orderId, phone } = req.body;
    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const accessToken = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    // Format phone: 2547XXXXXXXX
    let formattedPhone = phone.replace('+', '').replace(/\s/g, '');
    if (formattedPhone.startsWith('0')) formattedPhone = '254' + formattedPhone.slice(1);
    if (formattedPhone.startsWith('7')) formattedPhone = '254' + formattedPhone;

    const data = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: 1, // Using 1 for testing, in production use order.total
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: orderId,
      TransactionDesc: `Payment for Order ${orderId}`,
    };

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.ResponseCode === "0") {
      order.checkoutRequestId = response.data.CheckoutRequestID;
      await order.save();
    }

    res.json(response.data);
  } catch (error) {
    console.error('M-Pesa STK Push error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'STK Push failed' });
  }
};

const callback = async (req, res) => {
  try {
    const { Body } = req.body;
    if (!Body || !Body.stkCallback) {
       return res.status(400).json({ message: "Invalid callback data" });
    }

    const { stkCallback } = Body;
    const { ResultCode, ResultDesc, CheckoutRequestID } = stkCallback;

    console.log(`M-Pesa Callback for ${CheckoutRequestID}: ${ResultDesc} (Code: ${ResultCode})`);

    if (ResultCode === 0) {
      // Payment successful
      const order = await Order.findOne({ checkoutRequestId: CheckoutRequestID });
      if (order) {
        order.paymentStatus = 'Paid';
        await order.save();
        console.log(`Order ${order.orderId} marked as PAID via M-Pesa Callback`);
      }
    }

    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error) {
    console.error('M-Pesa Callback processing error:', error);
    res.status(500).json({ ResultCode: 1, ResultDesc: 'Internal Server Error' });
  }
};

module.exports = { stkPush, callback };
