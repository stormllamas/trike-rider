import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'

import { PROJECT_URL, DEBUG  } from "../actions/siteConfig"

import { createStackNavigator } from '@react-navigation/stack';

import { styles } from './common/Styles'

import { Layout, Menu, MenuGroup, MenuItem, IndexPath, Button, Modal, Card, Text, Divider, Spinner, Input } from '@ui-kitten/components';
import { BackHandler, Animated, Easing, Dimensions, View, Image, TouchableWithoutFeedback, ScrollView } from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons';
import { IOScrollView } from 'react-native-intersection-observer'

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Header from './layout/Header'
import BottomTabs from './layout/BottomTabs'

import OrderCard from './OrderCard'

import { setMenuToggler } from '../actions/siteConfig';
import { useBackButton } from './common/BackButtonHandler';
import { reroute, logout } from '../actions/auth';
import { getOrders, getOrder, newOrder, markOrder } from '../actions/manager'

import { LocalNotification } from '../services/LocalPushController'

import axios from 'axios';

const RootStack = createStackNavigator();

const OrdersManager = ({
  auth: {userLoading, isAuthenticated, user},
  siteConfig: {sideBarToggled},

  manager: {
    ordersLoading,
    orders,
    orderLoading,
    order
  },
  
  logout,
  setMenuToggler,

  getOrders,
  getOrder,
  newOrder,
  markOrder,

  reroute,
  navigation,
  route
}) => {
  // Root
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(new IndexPath(0));

  const [menuActive, setMenuActive] = useState(false)
  const [menuAnim, setMenuAnim] = useState(new Animated.Value(-Dimensions.get('window').width*.25))
  const [menuOverlayOpacity, setMenuOverlayAnim] = useState(new Animated.Value(1))
  const [menuOverlayWidth, setMenuOverlayWidth] = useState(new Animated.Value(-Dimensions.get('window').width))

  const mapRef = useRef();

  const handleBackButtonClick = () => {
    if (menuActive) {
      setMenuActive(false)
      return true;
    } else {
      BackHandler.exitApp()
      return true;
    }
  }
  useBackButton(handleBackButtonClick)

  useEffect(() => {
    reroute({
      navigation,
      type: 'private',
      userLoading,
      isAuthenticated,
      user
    })
  }, [userLoading]);

  useEffect(() => {
    if (menuActive) {
      Animated.timing(
        menuAnim,
        {
          toValue: 0,
          duration: 300,
          easing: Easing.back(),
          useNativeDriver: false,
        }
      ).start();
      Animated.timing(
        menuOverlayOpacity,
        {
          toValue: 0.5,
          duration: 400,
          easing: Easing.elastic(),
          useNativeDriver: false,
        }
      ).start();
      Animated.timing(
        menuOverlayWidth,
        {
          toValue: 0,
          duration: 0,
          easing: Easing.elastic(),
          useNativeDriver: false,
        }
      ).start();
    } else {
      Animated.timing(
        menuAnim,
        {
          toValue: -Dimensions.get('window').width*.75,
          duration: 400,
          easing: Easing.elastic(),
          useNativeDriver: false,
        }
      ).start();
      Animated.timing(
        menuOverlayOpacity,
        {
          toValue: 0,
          duration: 400,
          easing: Easing.elastic(),
          useNativeDriver: false,
        }
      ).start();
      Animated.timing(
        menuOverlayWidth,
        {
          toValue: Dimensions.get('window').width,
          delay: 400,
          duration: 0,
          easing: Easing.elastic(),
          useNativeDriver: false,
        }
      ).start();
    }
  }, [menuAnim, menuActive])


  useEffect(() => {
    setMenuToggler(false)
  }, []);

  useEffect(() => {
    setMenuActive(sideBarToggled)
  }, [sideBarToggled]);


  
  // useEffect(() => {
  //   let wsStart = 'ws://'
  //   let port = ''
  //   if (window.location.protocol === 'https:') {
  //     wsStart = 'wss://'
  //     port = ':8001'
  //   }
  //   let endpoint = wsStart + window.location.host + port
  //   setSocket(new ReconnectingWebSocket(endpoint+'/order_update/'))
  // }, []);

  

  // Order Manager
  const [keywords, setKeywords] = useState('')
  const [page, setPage] = useState(1)

  const [currentTab, setCurrentTab] = useState({ mode: 'unclaimed', claimed: false, pickedup: false, delivered: false })

  const [modalActive, setModalActive] = useState(false)
  const [addressModalActive, setAddressModalActive] = useState('')
  const [socket, setSocket] = useState('')
  
  useEffect(() => {
    setPage(1)
    getOrders({
      page: 1,
      claimed: currentTab.claimed,
      pickedup: currentTab.pickedup,
      delivered: currentTab.delivered,
      keywords: keywords,
    })
  }, [keywords, currentTab]);
  
  // useEffect(() => {
  //   if (page > 1) {
  //     getOrders({
  //       page: 1,
  //       claimed: currentTab.claimed,
  //       pickedup: currentTab.pickedup,
  //       delivered: currentTab.delivered,
  //       keywords: keywords,
  //       getMore: true,
  //     })
  //   }
  // }, [page]);
  

  useEffect(() => {
    if (order) {
      if (addressModalActive === 'pickup' || addressModalActive === 'delivery') {
        mapRef.current?.animateCamera({
          center: {
            latitude: addressModalActive === 'pickup' ? parseFloat(order.loc1_latitude) : parseFloat(order.loc2_latitude),
            longitude: addressModalActive === 'pickup' ? parseFloat(order.loc1_longitude) : parseFloat(order.loc2_longitude),
            latitudeDelta: 1,
            longitudeDelta: 1
          },
          zoom: 15
        })
      }
    }
  }, [order, mapRef])

  useEffect(() => {
    let wsStart = 'ws://'
    let port = ''
    if (DEBUG === false) {
      wsStart = 'wss://'
      port = ':8001'
    }
    let endpoint = wsStart + `${PROJECT_URL.replace((DEBUG ? 'http://' : 'https://'), '')}` + port
    setSocket(new WebSocket(endpoint+'/order_update/'))
  }, []);
  

  useEffect(() => {
    if (socket) {
      socket.onmessage = function(e){
        const data = JSON.parse(e.data)
        console.log('asdasdasd', data, currentTab)
        if ((data.mark === 'new_order' || data.mark === 'unclaim') && currentTab.mode === 'unclaimed') {
          console.log('newOrder')
          newOrder({ data })
        }
        if (currentTab.mode === 'unclaimed') {
          if (data.mark === 'claim' || data.mark === 'pickup' || data.mark === 'deliver' || data.mark === 'cancel') {
            markOrder({ data })
          }
        }
        if (currentTab.mode === 'claimed') {
          if (data.mark === 'pickup' || data.mark === 'deliver') {
            markOrder({ data })
          }
        }
        if (currentTab.mode === 'undelivered') {
          if (data.mark === 'deliver') {
            markOrder({ data })
          }
        }
      }
      socket.onopen = function(e){
        console.log('open', e)
      }
      socket.onerror = function(e){
        console.log('error', e)
      }
      socket.onclose = function(e){
        console.log('close', e)
      }
    }
    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [socket]);

  return (
    <>
      <Header subtitle='Order Manager'/>
      <Layout style={{ paddingHorizontal: 10, paddingVertical:5, paddingTop: 15 }} level="1">
        <Input
          placeholder='Search for a Ref Code'
          value={keywords}
          onChangeText={nextValue => setKeywords(nextValue)}
        />
      </Layout>
      <Layout style={styles.orderCardsWrapper} level="2">
        {/* <Button onPress={() => LocalNotification()}></Button> */}
        {/* <Button onPress={async () => {
          try {
            const res = await axios.post(`https://fcm.googleapis.com/fcm/send`, 
            {
              "condition": "'new-order' in topics",
              "data": {
                "hello": "This is a Firebase Cloud Messaging Device Group Message!"
              }
            }, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAAQuwm6JE:APA91bEmGIf6Y7Pxd0jXeRDfoFsSachsIluY5mJBMx7pKUmzLsszevv7mj_5qaL9lzHLNeRcDPCtIpG9dqASb5YwSMHyonoZiWTI6a2A1mHdeyN634yH9aIagPgMse_dpVg8T3smbphZ',
              }
            })
            
          } catch (error) {
            console.log(error)
            
          }
        }}></Button> */}
        {!ordersLoading ? (
          <IOScrollView contentContainerStyle={styles.orderCardsContainer}>
            {orders.results.length > 0 ? (
              orders.results.map((order, index) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  orders={orders}
                  getOrders={getOrders}
                  getOrder={getOrder}
                  index={index}
                  ordersLoading={ordersLoading}
                  setModalActive={setModalActive}
                  setAddressModalActive={setAddressModalActive}
                  currentTab={currentTab}
                  socket={socket}
                  navigation={navigation}
                />
              ))
            ) : (
              <View style={ styles.fullContainerMedium }>
                <Image
                  style={[{ marginBottom: 50, width: 150, height: 150, opacity: 0.5 }]}
                  source={{uri:`${PROJECT_URL}/static/frontend/img/Trike_no_bookings.png`}}
                />
                <Text category="h4" >No Bookings</Text>
              </View>
            )}
            {/* {moreOrdersLoading ? (
              <Layout level="2" style={{ flex: 1, alignItems: 'center', padding: 10 }}>
                <Spinner size='medium'></Spinner>
              </Layout>
            ) : undefined} */}
          </IOScrollView>
        ) : (
          <View style={styles.fullContainerLarge}>
            <Layout level="2" style={{ flex: 1, alignItems: 'center', padding: 10 }}>
              <Spinner size='medium'></Spinner>
            </Layout>
          </View>
        )}

        {/* Check Address */}
        <Modal visible={addressModalActive}>
          <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
            <MapView
              ref={mapRef}
              style={{ flex: 1, minHeight: 400 }}
              provider={PROVIDER_GOOGLE}
              showsUserLocation={true}
              initialRegion={{
                latitude: 13.946958175958924,
                longitude: 121.61064815344236,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }}
              loadingEnabled={true}
              minZoomLevel={13}
              maxZoomLevel={20}
            >
              {order && !orderLoading ? (
                <>
                  <Marker
                    pinColor={'#1C8DFF'}
                    draggable={false}
                    coordinate={{ latitude: parseFloat(order.loc1_latitude), longitude: parseFloat(order.loc1_longitude) }}
                    title={ 'Delivery' }
                  />
                  <Marker
                    pinColor={'#3DAC4C'}
                    draggable
                    coordinate={{ latitude: parseFloat(order.loc2_latitude), longitude: parseFloat(order.loc2_longitude) }}
                    title={ 'Delivery' }
                  />
                </>
              ) : (
                <></>
              )}
            </MapView>
            <Button
              style={[styles.hoverButton, {backgroundColor: '#15A1D6', borderColor: '#15A1D6'}]}
              onPress={() => setAddressModalActive('')}
              status="info"
            >
              DONE
            </Button>
          </View>
          { !order && orderLoading ? (
            <View style={[styles.overlay, {backgroundColor:'transparent', opacity: 1, alignItems: 'center', justifyContent: 'center', zIndex: 11}]}>
              <Spinner size='large'/>
            </View>
          ) : (
            <></>
          )}
        </Modal>

        {/* Menu */}
        <Animated.View style={[styles.overlay, { opacity: menuOverlayOpacity }, { left: menuOverlayWidth }]}>
          <TouchableWithoutFeedback onPress={() => setMenuActive(false)}>
            <View style={{ flex: 1, flexDirection: 'row' }}></View>
          </TouchableWithoutFeedback>
        </Animated.View>
        <Animated.View style={[styles.sideNav, { left: menuAnim }]}>
          <>
            <View>
              <Image
                style={{
                  height: 38,
                  width: 120,
                  alignSelf: 'center',
                  marginTop: 30,
                  marginBottom: 30,
                }}
                source={{uri:`${PROJECT_URL}/static/frontend/img/Trike_logo-whole.png`}}
              />
            </View>
            <Menu
              selectedIndex={new IndexPath(0)}
              onSelect={index => setSelectedMenuIndex(index)}>
              <MenuItem title='Home' accessoryLeft={() => <Ionicons size={22} name='home-outline'/>} onPress={() => setMenuActive(false)}/>
              <MenuItem title='My Bookings' accessoryLeft={() => <Ionicons size={22} name='cube-outline'/>} onPress={() => navigation.navigate('Bookings')}/>
              <Divider/>
              <MenuItem title='Account'/>
              <MenuItem title='My Profile' accessoryLeft={() => <Ionicons size={22} name='person-circle-outline'/>} onPress={() => navigation.navigate('Profile')}/>
              <MenuItem title='Security' accessoryLeft={() => <Ionicons size={22} name='shield-outline'/>} onPress={() => navigation.navigate('Security')}/>
              <MenuItem title='Logout' accessoryLeft={() => <Ionicons size={22} name='log-out-outline'/>} onPress={() => {logout()}}/>
              {/* <MenuGroup title='Account'>
              </MenuGroup> */}
            </Menu>
          </>
        </Animated.View>


        {/* <Animated.View style={[styles.superModal, { top: modalAnim, height: Dimensions.get('window').height-80  }]}>
          <TopNavigation
            accessoryLeft={() => <TopNavigationAction onPress={() => setModalActive('')} icon={props => <Icon {...props} name='arrow-back'/>}/>}
            title={modalActive === 'pickup' ? 'Set a Pickup Address' : 'Set a Delivery Address'}
          />
          {loading && (
            <View style={[styles.overlay, {backgroundColor:'transparent', opacity: 1, alignItems: 'center', justifyContent: 'center', zIndex: 11}]}>
              <Spinner size='large'/>
            </View>
          )}
          <GooglePlacesAutocomplete
            ref={ref}
            placeholder='Search'
            onPress={async (data) => {
              setLoading(true)
              const res = await locationGeocode({ placeId: data.place_id })
              const lat = res.data.geometry.location.lat
              const lng = res.data.geometry.location.lng
              if (modalActive === 'pickup') {
                setPickupLat(lat)
                setPickupLng(lng)
                setPickupAddress(res.data.formatted_address)
                // setPickupAddressIndex(new IndexPath(0))
                // setPickupAddressBook(false)
                mapClicked({ mode: 'pickup', lat, lng })
              } else if (modalActive === 'delivery') {
                setDeliveryLat(lat)
                setDeliveryLng(lng)
                setDeliveryAddress(res.data.formatted_address)
                // setDeliveryAddressIndex(new IndexPath(0))
                // setDeliveryAddressBook(false)
                mapClicked({ mode: 'delivery', lat, lng })
              }
              setAutoCompleteText(res.data.formatted_address)
              ref.current?.setAddressText(res.data.formatted_address)
              ref.current?.blur()
              setLoading(false)
            }}
            query={{
              key: GOOGLE_API_KEY,
              language: 'en',
              components: 'country:ph',
              location: "13.946958175958924, 121.61064815344236",
              radius: "15000",
              strictbounds: true,
            }}
            textInputProps={{
              onFocus: () => setAutoCompleteFocused(true),
              onBlur: () => setAutoCompleteFocused(false),
              onChangeText: e => setAutoCompleteText(e)
            }}
            // currentLocation={true}
            // currentLocationLabel='My Current Location'
            styles={{
              container: {
                maxHeight: keyboardActive && autoCompleteFocused && autoCompleteText.length >= 1 ? null : 50,
                borderTopWidth: 1,
                borderRadius: 0,
                borderColor: "#E7EAED",
              },
              textInputContainer: {
                paddingRight: 35
              },
              textInput: {
                height: 45,
                color: '#5d5d5d',
                fontSize: 16,
                borderRadius: 0,
              },
              listView: {
                position: 'absolute',
                top: 45,
                left: 0,
                border: 0,
                backgroundColor: 'grey',
              }
              
            }}
          >
            <Ionicons name="close-circle" size={22} color={'#ECECEC'} style={{ position: 'absolute', zIndex: 9, right: 12, top: 12 }} onPress={() => {ref.current?.setAddressText(''), setAutoCompleteText('')}}/>
          </GooglePlacesAutocomplete>
          <Button
            style={ styles.hoverButton }
            // disabled={!deliveryLat || !deliveryLng ? true : false}
            onPress={() => setModalActive('')}
            status="info"
          >
            DONE
          </Button>
        </Animated.View> */}
      </Layout>
      

      {/* Check Order */}
      {/* <Modal visible={modalActive}> */}
      {modalActive && (
        <Layout style={{ position: 'absolute', top: 0, width: Dimensions.get('window').width, height: Dimensions.get('window').height, zIndex: 100 }}>
          <View style={{ flex: 1 }}>
            { order && !orderLoading ? (
              <ScrollView style={{ padding: 15 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text category="h6">Booking Summary <Text style={{ fontSize: 14 }}>#{order.ref_code}</Text></Text>
                  <Button size="small" onPress={() => setModalActive(false)} style={{}}>
                    X
                  </Button>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Input value={order.first_name} label='First Name' disabled={true} style={{ marginTop: 10, marginRight: 10, flex: 1 }} textStyle={{ color: 'white' }}/>
                  <Input value={order.last_name} label='Last Name' disabled={true} style={{ marginTop: 10, marginLeft: 10, flex: 1 }} textStyle={{ color: 'white' }}/>
                </View>
                <Input value={order.contact} label='Contact' disabled={true} style={{ marginTop: 10 }} textStyle={{ color: 'white' }}/>
                <Input value={order.email} label='Email' disabled={true} style={{ marginTop: 10 }} textStyle={{ color: 'white' }}/>
                <Input value={order.gender} label='Gender' disabled={true} style={{ marginTop: 10 }} textStyle={{ color: 'white' }}/>
                {order.order_type === 'food' && (
                  <View style={{ marginTop: 30 }}>
                    <Text category="h6">Order Items</Text>
                    {order.order_items.map(orderItem => (
                      <View key={orderItem.id} style={[styles.orderItem, { marginTop: 10, marginBottom: 30 }]}>
                        <Image style={styles.orderItemImage} source={{ uri: `${PROJECT_URL}${orderItem.product.thumbnail}`}}></Image>
                        <View>
                          <Text style={{ marginBottom: 5, fontFamily: 'Lato-Bold' }}>{orderItem.product.name} - {orderItem.product_variant.name}</Text>
                          <Text style={[styles.mute, { fontSize: 14 }]}>{orderItem.quantity} x ₱ {orderItem.ordered_price.toFixed(2)}</Text>
                          <Text>₱ {(orderItem.quantity*orderItem.ordered_price).toFixed(2)}</Text>
                        </View>
                      </View>
                    ))}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ marginBottom: 5, fontFamily: 'Lato-Bold' }}>Subtotal:</Text>
                      <Text style={{ fontSize: 13 }}>₱ {order.subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ marginBottom: 5, fontFamily: 'Lato-Bold' }}>Delivery:</Text>
                      <Text style={{ fontSize: 13 }}>₱ {order.ordered_shipping.toFixed(2)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
                      <Text style={{ marginBottom: 5, fontFamily: 'Lato-Bold' }}>Total:</Text>
                      <Text style={{ fontSize: 13 }}>₱ {order.total.toFixed(2)}</Text>
                    </View>
                    <Input
                      value={order.description}
                      label='Description'
                      multiline={true}
                      textStyle={{ minHeight: 64, textAlignVertical : 'top' }}
                      placeholder='No Description'
                    />
                  </View>
                )}
                <Button onPress={() => setModalActive(false)} style={{ marginTop: 40, marginBottom: 100 }}>
                  DISMISS
                </Button>
              </ScrollView>
            ) : (
              <Card disabled={true} style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, alignItems: 'center', justifyContent: 'center'}}>
                <Spinner size='medium'></Spinner>
              </Card>
            )}
          </View>
        </Layout>
      )}
      {/* </Modal> */}
      <BottomTabs navigation={navigation} setCurrentTab={setCurrentTab}/>
    </>
  )
}

OrdersManager.protoTypes = {
  reroute: PropTypes.func.isRequired,
  setMenuToggler: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  newOrder: PropTypes.func.isRequired,
  markOrder: PropTypes.func.isRequired,
  getOrders: PropTypes.func.isRequired,
  getOrder: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  manager: state.manager,
  siteConfig: state.siteConfig
});

export default connect(mapStateToProps, { reroute, setMenuToggler, logout, newOrder, markOrder, getOrders, getOrder })(OrdersManager);