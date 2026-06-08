import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Set up axios defaults
const api = axios.create({
  baseURL: API_URL,
});

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('edc_token');
    const savedUser = localStorage.getItem('edc_user');
    if (token && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchData(parsedUser);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = async (currentUser = user) => {
    try {
      const requests = [
        api.get('/orders'),
        api.get('/notifications')
      ];

      if (currentUser && currentUser.role === 'admin') {
        requests.push(api.get('/auth/users'));
      }

      const results = await Promise.all(requests);
      setOrders(results[0].data);
      setNotifications(results[1].data);
      
      if (currentUser && currentUser.role === 'admin') {
        setUsers(results[2].data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user: userData } = res.data;
      setUser(userData);
      localStorage.setItem('edc_token', token);
      localStorage.setItem('edc_user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await fetchData();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      const { token, user: newUser } = res.data;
      setUser(newUser);
      localStorage.setItem('edc_token', token);
      localStorage.setItem('edc_user', JSON.stringify(newUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await fetchData();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setOrders([]);
    setNotifications([]);
    localStorage.removeItem('edc_token');
    localStorage.removeItem('edc_user');
    delete api.defaults.headers.common['Authorization'];
  };

  const addOrder = async (orderData) => {
    try {
      // Use FormData if there are images, otherwise JSON
      let data;
      let headers = {};
      
      if (orderData.images && orderData.images.length > 0) {
        data = new FormData();
        Object.keys(orderData).forEach(key => {
          if (key === 'images') {
            orderData.images.forEach(img => data.append('images', img));
          } else {
            data.append(key, orderData[key]);
          }
        });
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        data = orderData;
      }

      const res = await api.post('/orders', data, { headers });
      setOrders([res.data, ...orders]);
      addNotification(`New order ${res.data.orderId} placed successfully!`, 'success');
      return res.data;
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId, status, statusIndex) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status, statusIndex });
      setOrders(orders.map(o => o.orderId === orderId ? res.data : o));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/payment`, { paymentStatus });
      setOrders(orders.map(o => o.orderId === orderId ? res.data : o));
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const triggerMpesa = async (orderId, phone) => {
    try {
      const res = await api.post('/payments/mpesa/stkpush', { orderId, phone });
      return res.data;
    } catch (error) {
      console.error('M-Pesa trigger error:', error);
      throw error;
    }
  };

  const addNotification = (message, type = 'info') => {
    // Local update for immediate feedback, although server also creates one
    const notif = { id: Date.now(), message, type, read: false, createdAt: new Date().toISOString() };
    setNotifications([notif, ...notifications].slice(0, 20));
  };

  const markNotificationsRead = async () => {
    try {
      await api.put('/notifications/read');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking notifications read:', error);
    }
  };

  const getUserOrders = () => orders;

  return (
    <AppContext.Provider value={{
      user, login, logout, register, loading,
      orders, users, addOrder, updateOrderStatus, updatePaymentStatus, triggerMpesa, getUserOrders,
      notifications, markNotificationsRead,
    }}>
      {children}
    </AppContext.Provider>
  );
};
