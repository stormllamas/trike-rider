import axios from 'axios';
import { Alert } from 'react-native'

import { PROJECT_URL } from './siteConfig'

import {
  GET_ORDER_ITEMS,
  ORDER_ITEMS_ERROR,
  
  MANAGER_ORDERS_LOADING,
  GET_MANAGER_ORDERS,
  MANAGER_ORDERS_ERROR,

  MANAGER_ORDER_LOADING,
  GET_MANAGER_ORDER,
  MANAGER_ORDER_ERROR,

  CLAIM_ORDER,
  RIDER_CANCEL_ORDER,
  RIDER_UNCLAIM_ORDER,
  PREPARE_ORDER,

  DELIVER_ORDER_ITEM,
  DELIVER_ORDER,

  PICKUP_ORDER_ITEM,
  PICKUP_ORDER,

  TOGGLING_IS_PUBLISHED,
  TOGGLED_IS_PUBLISHED,
  IS_PUBLISHED_ERROR,

  NEW_ORDER_UPDATE,
  MARK_ORDER,

  AUTH_ERROR,
} from './types'


import { tokenConfig } from './auth';


export const getOrders = ({ page, claimed, prepared, pickedup, delivered, keywords, range }) => async (dispatch, getState) => {
  dispatch({type: MANAGER_ORDERS_LOADING});
  try {
    let res;
    if (range) {
      res = await axios.get(`${PROJECT_URL}/api/manager/orders?range=${range}`, tokenConfig(getState))
    } else {
      res = await axios.get(`${PROJECT_URL}/api/manager/orders?page=${page ? page : '0'}${claimed !== undefined ? `&claimed=${claimed}` : ''}${prepared !== undefined ? `&prepared=${prepared}` : ''}${pickedup !== undefined ? `&pickedup=${pickedup}` : ''}${delivered !== undefined ? `&delivered=${delivered}` : ''}${keywords !== undefined ? `&keywords=${keywords}` : ''}`, tokenConfig(getState))
    }
    dispatch({
      type: GET_MANAGER_ORDERS,
      payload: res.data
    });
  } catch (err) {
    dispatch({type: MANAGER_ORDERS_ERROR});
    // dispatch({type: AUTH_ERROR});
  }
}
export const getOrder = ({ id }) => async (dispatch, getState) => {
  dispatch({type: MANAGER_ORDER_LOADING});
  try {
    const res = await axios.get(`${PROJECT_URL}/api/manager/order/${id}/`, tokenConfig(getState))
    dispatch({
      type: GET_MANAGER_ORDER,
      payload: res.data
    });
  } catch (err) {
    dispatch({type: AUTH_ERROR});
    dispatch({type: MANAGER_ORDER_ERROR});
  }
}

export const toggleIsPublished = ({ id }) => async (dispatch, getState) => {
  dispatch({ type: TOGGLING_IS_PUBLISHED });
  try {
    await axios.put(`${PROJECT_URL}/api/manager/toggle_is_published/${id}/`, null, tokenConfig(getState))
    dispatch({
      type: TOGGLED_IS_PUBLISHED,
      payload: id
    });
  } catch (err) {
    dispatch({ type: IS_PUBLISHED_ERROR });
  }
}

export const claimOrder = ({ id, socket }) => async (dispatch, getState) => {
  try {
    const res = await axios.put(`${PROJECT_URL}/api/manager/claim_order/${id}/`, null, tokenConfig(getState))
    if (res.data.status) {
      if (res.data.status === 'error' && res.data.msg === 'Order already claimed') {
        await dispatch(getOrders({
          page: 1,
          claimed: false,
          delivered: false,
          keywords: ''
        }))
        Alert.alert(
          "",
          res.data.msg,
          [
            { text: "OK" }
          ],
          { cancelable: true }
        )
      }
    } else {
      dispatch({
        type: CLAIM_ORDER,
        payload: res.data
      });
      Alert.alert(
        "",
        'Orders Claimed',
        [
          { text: "OK" }
        ],
        { cancelable: true }
      )
      socket.send(JSON.stringify({
        'mark' : 'claim',
        'order_id' : id,
      }))
    }
  } catch (err) {
    await dispatch(getOrders({
      page: 1,
      claimed: false,
      delivered: false,
      keywords: ''
    }))
  }
}
export const prepareOrder = ({ id, socket }) => async (dispatch, getState) => {
  try {
    const res = await axios.put(`${PROJECT_URL}/api/manager/prepare_order/${id}/`, null, tokenConfig(getState))
    if (res.data.status) {
      if (res.data.status === 'error' && res.data.msg === 'Order already prepared') {
        await dispatch(getOrders({
          page: 1,
          prepared: false,
          keywords: ''
        }))
        M.toast({
          html: res.data.msg,
          displayLength: 5000,
          classes: 'red'
        });
      }
    } else {
      dispatch({
        type: PREPARE_ORDER,
        payload: res.data
      });
      M.toast({
        html: 'Order Prepared',
        displayLength: 5000,
        classes: 'orange'
      });
    }
  } catch (err) {
    await dispatch(getOrders({
      page: 1,
      prepared: false,
      keywords: ''
    }))
    $('.loader').fadeOut();
  }
}
export const cancelOrder = ({ id }) => async (dispatch, getState) => {
  $('.loader').fadeIn();
  try {
    const res = await axios.put(`${PROJECT_URL}/api/manager/cancel_order/${id}/`, null, tokenConfig(getState))
    if (res.data.status) {
      if (res.data.status === 'error' && res.data.msg === 'Order already canceled') {
        await dispatch(getOrders({
          page: 1,
          claimed: true,
          pickedup: false,
          delivered: false,
          keywords: ''
        }))
        M.toast({
          html: res.data.msg,
          displayLength: 5000,
          classes: 'red'
        });
      }
    } else {
      dispatch({
        type: RIDER_CANCEL_ORDER,
        payload: res.data
      });
      M.toast({
        html: 'Order Canceled',
        displayLength: 5000,
        classes: 'orange'
      });
    }
    $('.loader').fadeOut();
  } catch (err) {
    M.toast({
      html: 'Opps something happend. Try again.',
      displayLength: 5000,
      classes: 'red'
    });
    await dispatch(getOrders({
      page: 1,
      claimed: true,
      pickedup: false,
      delivered: false,
      keywords: ''
    }))
    $('.loader').fadeOut();
  }
}
export const unclaimOrder = ({ id }) => async (dispatch, getState) => {
  $('.loader').fadeIn();
  try {
    const res = await axios.put(`${PROJECT_URL}/api/manager/unclaim_order/${id}/`, null, tokenConfig(getState))
    if (res.data.status) {
      if (res.data.status === 'error' && res.data.msg === 'Order already unclaimed') {
        await dispatch(getOrders({
          page: 1,
          claimed: true,
          pickedup: false,
          delivered: false,
          keywords: ''
        }))
        M.toast({
          html: res.data.msg,
          displayLength: 5000,
          classes: 'red'
        });
      }
    } else {
      dispatch({
        type: RIDER_UNCLAIM_ORDER,
        payload: res.data
      });
      M.toast({
        html: 'Order Unclaimed',
        displayLength: 5000,
        classes: 'blue'
      });
    }
    $('.loader').fadeOut();
  } catch (err) {
    M.toast({
      html: 'Opps something happend. Try again.',
      displayLength: 5000,
      classes: 'red'
    });
    await dispatch(getOrders({
      page: 1,
      claimed: true,
      pickedup: false,
      delivered: false,
      keywords: ''
    }))
    $('.loader').fadeOut();
  }
}
export const pickupOrderItem = ({ id, socket }) => async (dispatch, getState) => {
  $('.loader').fadeIn();

  try {
    const res = await axios.put(`${PROJECT_URL}/api/manager/pickup_order_item/${id}/`, null, tokenConfig(getState))
    if (res.data.status === 'error') {
      M.toast( {
        html: res.data.msg,
        displayLength: 5000,
        classes: 'red'
      });
    } else {
      await dispatch({
        type: PICKUP_ORDER_ITEM,
        payload: parseInt(id)
      });
      M.toast({
        html: 'Item marked as picked up',
        displayLength: 5000,
        classes: 'orange'
      });
      if (res.data.order_picked_up) {
        await dispatch({
          type: PICKUP_ORDER,
          payload: getState().manager.order
        });
        M.toast({
          html: 'Order picked up',
          displayLength: 5000,
          classes: 'blue'
        });
        socket.send(JSON.stringify({
          'mark' : 'pickup',
          'order_id' : getState().manager.order.id,
        }))
      }
    }
    $('.loader').fadeOut();
  } catch (error) {
    $('.loader').fadeOut();
  }
}
export const pickupOrder = ({ id, socket }) => async (dispatch, getState) => {
  try {
    const res = await axios.put(`${PROJECT_URL}/api/manager/pickup_order/${id}/`, null, tokenConfig(getState))
    if (res.data.status) {
      if (res.data.status === 'error' && res.data.msg === 'Order already picked up') {
        await dispatch(getOrders({
          page: 1,
          claimed: true,
          delivered: false,
          keywords: ''
        }))
        Alert.alert(
          "",
          res.data.msg,
          [
            { text: "OK" }
          ],
          { cancelable: true }
        )
      }
    } else {
      dispatch({
        type: PICKUP_ORDER,
        payload: res.data
      });
      Alert.alert(
        "",
        'Order marked as picked up',
        [
          { text: "OK" }
        ],
        { cancelable: true }
      )
      socket.send(JSON.stringify({
        'mark' : 'pickup',
        'order_id' : id,
      }))
    }
  } catch (error) {
    console.log(error)
  }
}
export const deliverOrderItem = ({ id, socket }) => async (dispatch, getState) => {
  $('.loader').fadeIn();

  try {
    const res = await axios.put(`${PROJECT_URL}/api/manager/deliver_order_item/${id}/`, null, tokenConfig(getState))
    if (res.data.status === 'error') {
      M.toast( {
        html: res.data.msg,
        displayLength: 5000,
        classes: 'red'
      });
    } else {
      await dispatch({
        type: DELIVER_ORDER_ITEM,
        payload: id
      });
      M.toast({
        html: 'Item marked as delivered',
        displayLength: 5000,
        classes: 'orange'
      });
      if (res.data.order_delivered) {
        await dispatch({
          type: DELIVER_ORDER,
          payload: getState().manager.order
        });
        M.toast({
          html: 'Order delivered',
          displayLength: 5000,
          classes: 'blue'
        });
        socket.send(JSON.stringify({
          'mark' : 'deliver',
          'order_id' : getState().manager.order.id,
        }))
      }
    }
    $('.loader').fadeOut();
  } catch (error) {
    $('.loader').fadeOut();
  }
}
export const deliverOrder = ({ id, socket }) => async (dispatch, getState) => {
  try {
    const res = await axios.put(`${PROJECT_URL}/api/manager/deliver_order/${id}/`, null, tokenConfig(getState))
    if (res.data.status) {
      if (res.data.status === 'error' && res.data.msg === 'Order already delivered') {
        await dispatch(getOrders({
          page: 1,
          claimed: true,
          delivered: false,
          keywords: ''
        }))
        Alert.alert(
          "",
          res.data.msg,
          [
            { text: "OK" }
          ],
          { cancelable: true }
        )
      }
    } else {
      dispatch({
        type: DELIVER_ORDER,
        payload: res.data
      });
      dispatch({
        type: PICKUP_ORDER,
        payload: res.data
      });
      Alert.alert(
        "",
        'Order fulfilled',
        [
          { text: "OK" }
        ],
        { cancelable: true }
      )
      socket.send(JSON.stringify({
        'mark' : 'deliver',
        'order_id' : id,
      }))
    }
  } catch (error) {
    console.log(error)
  }
}

export const getOrderItems = ({ page, delivered, keywords, range }) => async (dispatch, getState) => {
  $('.loader').fadeIn();
  try {
    let res;
    if (range) {
      res = await axios.get(`${PROJECT_URL}/api/manager/order_items?range=${range}`, tokenConfig(getState))
    } else {
      res = await axios.get(`${PROJECT_URL}/api/manager/order_items?page=${page ? page : '0'}&delivered=${delivered ? delivered : 'false'}&keywords=${keywords}`, tokenConfig(getState))
    }
    dispatch({
      type: GET_ORDER_ITEMS,
      payload: res.data
    });
    $('.loader').fadeOut();
  } catch (err) {
    dispatch({type: ORDER_ITEMS_ERROR});
    dispatch({type: AUTH_ERROR});
    $('.loader').fadeOut();
  }
}
export const getRefunds = ({ page, delivered, keywords, range }) => async (dispatch, getState) => {
  $('.loader').fadeIn();
  try {
    let res;
    if (range) {
      res = await axios.get(`${PROJECT_URL}/api/manager/order_items?range=${range}`, tokenConfig(getState))
    } else {
      res = await axios.get(`${PROJECT_URL}/api/manager/order_items?page=${page ? page : '0'}&delivered=${delivered ? delivered : 'false'}&keywords=${keywords}`, tokenConfig(getState))
    }
    dispatch({
      type: GET_ORDER_ITEMS,
      payload: res.data
    });
    $('.loader').fadeOut();
  } catch (err) {
    dispatch({type: ORDER_ITEMS_ERROR});
    $('.loader').fadeOut();
  }
}

export const newOrder = ({ data }) => async (dispatch, getState) => {
  let orderExists = false
  getState().manager.orders.results.forEach(order => {
    if (order.id === data.order.id) {
      orderExists = true;
      return
    } 
  })
  if (!orderExists) {
    dispatch({
      type: NEW_ORDER_UPDATE,
      payload: data
    })
  }
}

export const markOrder = ({ data }) => async (dispatch, getState) => {
  dispatch({
    type: MARK_ORDER,
    payload: data
  })
}