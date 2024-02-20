import React, { useEffect } from 'react';
import { Icon, Text, Card, Button } from '@ui-kitten/components';
import { View, TouchableOpacity, Image } from 'react-native'
import PropTypes from 'prop-types'

import { InView } from 'react-native-intersection-observer'
import moment from 'moment'

import { connect } from 'react-redux';
import { claimOrder, getOrders, pickupOrderItem, pickupOrder, cancelOrder, unclaimOrder, deliverOrderItem, deliverOrder } from '../actions/manager';
import { styles } from './common/Styles'


const OrderCard = ({
  ordersLoading,
  order,
  orders,
  socket,

  claimOrder,
  
  pickupOrderItem, pickupOrder,
  cancelOrder,
  unclaimOrder,

  deliverOrderItem, deliverOrder,

  getOrders,
  getOrder,
  setModalActive,
  setAddressModalActive,
  currentTab,

  index,
  
  navigation
}) => {

  const lastProductElement = (inView) => {
    // console.log(inView)
    // if (inView && orders.results.length == index+1 && orders.next !== null && !ordersLoading) {
    //   getOrders({
    //     getMore: true
    //   })
    // }
  }
  
  return (
    <InView onChange={inView => lastProductElement(inView)}>
      <Card style={styles.orderCard}
        header={() => 
          <View style={styles.orderCardHeader}>
            <Text style={{ fontFamily: 'Lato-Bold', fontSize: 13, color: '#FAA634' }} onPress={() => {getOrder({ id:order.id }); setModalActive(true)}}>#{order.ref_code}</Text>
            <Text style={{ fontFamily: 'Lato-Bold', fontSize: 13 }}>Placed: {moment(order.date_ordered).format('MM/DD/yy - hh:mm a')}</Text>
          </View>
        }
        footer={() => 
          <View style={styles.orderCardFooter}>
            <Button size="small" 
              onPress={() => {
                if (currentTab.mode === 'unclaimed') {
                  claimOrder({ id: order.id, socket: socket })
                } else if (currentTab.mode === 'claimed') {
                  pickupOrder({ id: order.id, socket: socket })
                } else if (currentTab.mode === 'undelivered') {
                  deliverOrder({ id: order.id, socket: socket })
                }
              }}

              disabled={currentTab.mode === 'delivered' ? true : false}
            >
              {currentTab.mode === 'unclaimed' && 'CLAIM'}
              {currentTab.mode === 'claimed' && 'PICKUP'}
              {currentTab.mode === 'undelivered' && 'DELIVER'}
              {currentTab.mode === 'delivered' && 'DELIVERED'}
            </Button>
            <Text style={{ fontFamily: 'Lato-Bold', fontSize: 13, textTransform: 'uppercase' }}>{order.order_type.replace('_', ' ')}</Text>
            <Text style={{ fontFamily: 'Lato-Bold', fontSize: 13, textTransform: 'uppercase' }}>₱ {order.total.toFixed(2)}</Text>
          </View>
        }
        disabled={true}
        // onPress={() => navigation.navigate('RestaurantDetail', { selectedSeller: order.name })}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 13 }}>Payment Needed: {order.rider_payment_needed === true ? 'Yes' : 'No'}</Text>
          <Text style={{ fontSize: 13 }}>Payment: {order.payment_type === 1 ? 'COD' : 'Card'}</Text>
        </View>
        <Text style={{ fontSize: 13 }}>Two-way: {order.two_way === true ? 'Yes' : 'No'}</Text>
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontFamily: 'Lato-Bold', flex: 1, color: '#1DCDF9' }} onPress={() => {getOrder({ id:order.id }); setAddressModalActive('pickup')}}>Pickup: {order.order_type === 'food' && order.seller.name} {order.loc1_address}</Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontFamily: 'Lato-Bold', flex: 1, color: '#A2E83A' }} onPress={() => {getOrder({ id:order.id }); setAddressModalActive('delivery')}}>Delivery: {order.loc2_address}</Text>
        </View>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
          <Text style={{ fontFamily: 'Lato-Bold', fontSize: 13 }}>Subtotal</Text>
          <Text style={{ fontSize: 13 }}>₱ {order.subtotal.toFixed(2)}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: 'Lato-Bold', fontSize: 13 }}>Delivery</Text>
          <Text style={{ fontSize: 13 }}>₱ {order.ordered_shipping.toFixed(2)}</Text>
        </View>
        {/* <View style={{ alignItems: 'flex-start' }}>
          {order.review_count > 0 ? (
            <View style={{ marginLeft: -2, marginTop: 5, flexDirection: 'row' }}>
              {[...Array(order.total_rating).keys()].map(star => <Icon key={star} name='star' fill='#F2BE4D' style={{ height: 23, width: 23}}>star</Icon>)}
              {[...Array(Math.max(5-parseInt(order.total_rating), 0)).keys()].map(star => <Icon key={star} name='star' fill='#E0E0E0' style={{ height: 23, width: 23}}>star</Icon>)}
            </View>
          ) : (
            <View style={{ paddingVertical: 4, paddingHorizontal: 8, backgroundColor: '#e8e8e8', borderRadius: 4 }}>
              <Text  style={{ color: '#222222'}}>Unrated</Text>
            </View>
          )}
        </View> */}
      </Card>
    </InView>
  )
}


OrderCard.propTypes = {
  getOrders: PropTypes.func.isRequired,
  claimOrder: PropTypes.func.isRequired,
  pickupOrderItem: PropTypes.func.isRequired,
  pickupOrder: PropTypes.func.isRequired,
  cancelOrder: PropTypes.func.isRequired,
  unclaimOrder: PropTypes.func.isRequired,
  deliverOrderItem: PropTypes.func.isRequired,
  deliverOrder: PropTypes.func.isRequired
}

export default connect(null, { getOrders, claimOrder, pickupOrderItem, pickupOrder, cancelOrder, unclaimOrder, deliverOrderItem, deliverOrder })(OrderCard);