const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const Transaction = require('../models/Transaction');

const router = express.Router();

// Initialize payment
router.post('/initialize', async (req, res) => {
  console.log('Payment initialize request body:', req.body);
  try {
    const { amount, email, first_name, last_name, phone_number, currency = 'ETB' } = req.body;
    console.log('Parsed payment fields:', { amount, email, first_name, last_name, phone_number, currency });
    const tx_ref = uuidv4();

    const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const paymentData = {
      amount,
      currency,
      email,
      first_name,
      last_name,
      phone_number,
      tx_ref,
      callback_url: `${serverUrl}/api/payment/verify`,
      return_url: `${clientUrl}/payment/success`
    };

    const response = await axios.post(
      'https://api.chapa.co/v1/transaction/initialize',
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ status: 'success', checkout_url: response.data.data.checkout_url });
  } catch (error) {
    console.error('Initialization error:', error.response?.data || error.message);
    const msg = error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
    res.status(error.response?.status || 500).json({ status: 'error', message: msg });
  }
});

// Verify transaction
router.get('/verify', async (req, res) => {
  const { trx_ref, status } = req.query;
  if (status !== 'success') {
    return res.status(400).json({ status: 'error', message: 'Payment not successful' });
  }

  try {
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${trx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );
    const data = response.data.data;

    const transaction = new Transaction({
      tx_ref: trx_ref,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      customer: {
        email: data.customer.email,
        first_name: data.customer.first_name,
        last_name: data.customer.last_name,
        phone_number: data.customer.phone_number,
      },
    });

    await transaction.save();
    res.json({ status: 'success', data });
  } catch (error) {
    console.error('Verification error:', error.response?.data || error.message);
    const msg = error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
    res.status(error.response?.status || 500).json({ status: 'error', message: msg });
  }
});

module.exports = router;
