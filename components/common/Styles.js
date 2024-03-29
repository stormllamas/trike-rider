import { StyleSheet, Dimensions } from 'react-native'

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

export const styles = StyleSheet.create({
  topAlert: {
    zIndex:1,
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: '#FAA634',
    width: deviceWidth,
    paddingBottom: 10,
    paddingTop: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'
  },
  topAlertText: {
    fontSize: 16,
    fontFamily: 'Lato-Bold',
    color: '#ffffff',
    textAlign: 'center'
  },
  hoverButton: {
    position: 'absolute',
    width: deviceWidth*.8,
    bottom: 50,
    left: deviceWidth*.1
  },
  authCard: {
    marginTop: 15,
    marginHorizontal: 20,
    justifyContent: 'center',
    padding: 25,
    paddingHorizontal: 10
  },
  inputGroup: {
    marginBottom: 15,
  },
  link : {
    color: '#1C8DFF'
  },
  superModal: {
    position: 'absolute',
    height: deviceHeight,
    width: deviceWidth,
    padding: 0,
    zIndex: 10,
    backgroundColor: '#ffffff',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5
  },
  sideNav: {
    position: 'absolute',
    height: deviceHeight,
    width: deviceWidth*.75,
    padding: 0,
    zIndex: 10,
    backgroundColor: '#ffffff'
  },
  overlay: {
    position: 'absolute',
    height: deviceHeight,
    width: deviceWidth,
    padding: 0,
    zIndex: 10,
    backgroundColor: '#000000',
    opacity: .50
  },
  loader: {
    position: 'absolute',
    height: deviceHeight,
    width: deviceWidth,
    padding: 0,
    zIndex: 10,
    backgroundColor: '#000000',
    opacity: .50,
    backgroundColor:'transparent',
    opacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 11
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  fullContainerSmall: {
    flex: 1,
    paddingVertical: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullContainerMedium: {
    flex: 1,
    paddingVertical: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullContainerLarge: {
    flex: 1,
    paddingVertical: '75%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tinyLogo: {
    height: 50,
    width: 155,
    alignSelf: 'center',
    marginBottom: 50,
  },
  mute: {
    color: '#959595'
  },
  small: {
    fontSize: 12
  },
  label: {
    color: '#959595',
    fontSize: 12,
    paddingTop: 10
  },
  inputSummary: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    color: '#6A6A6A'
  },
  // Box with Shadow
  boxWithShadowContainer: {
    padding: 15,
    backgroundColor: '#F8F8F8'
  },
  boxWithShadow: {
    borderWidth: 1,
    borderColor: '#F2F2F2',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2
  },
  boxHeader: {
    paddingVertical: 15,
    paddingHorizontal: 18,
    backgroundColor: '#F8F8F8',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  boxBody: {
    paddingVertical: 15,
    paddingHorizontal: 18
  },
  // Shopping Card List
  orderCardsWrapper: {
    flex:1,
  },
  orderCardsContainer: {
    paddingTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  orderCard: {
    width: (deviceWidth)-30,
    marginVertical: 5,
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 10,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2
  },
  orderCardHeader: {
    marginVertical: 10,
    marginHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  orderCardFooter: {
    marginVertical: 10,
    marginHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  shoppingCardImage: {
    height: 150,
    width: (deviceWidth/2)-18
  },

  // Food Cart
  foodCartButton: {
    width: 55,
    height: 53.5,
    paddingRight: 1.5,
    position: 'absolute',
    bottom: 15,
    right: 18,
    zIndex: 2,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#53A557',
    borderColor: '#53A557',
    borderRadius: 100,

    shadowColor: '#AFB1B1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5
  },

  // Order Item List
  orderItem: {
    position: 'relative',
    flexDirection: 'row',
    padding: 5,
    marginBottom: 10
  },
  orderItemImage: {
    height: 50,
    width: 50,
    marginRight: 10,
    borderRadius: 50,
  },
  orderItemImageLarge: {
    height: 100,
    width: 100,
    borderRadius: 100,
  },
  // Product Quantity
  productQuantity: {
    flexDirection: 'row',
    marginBottom: 10,
    height: 25,
  },
  increaseQuantity: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    height: 25,
    width: 25,
    borderWidth: 1,
    borderColor: '#dee2e6',
    backgroundColor: '#ffffff',
    marginLeft: -1,
  },
  decreaseQuantity: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    height: 25,
    width: 25,
    borderWidth: 1,
    borderColor: '#dee2e6',
    backgroundColor: '#ffffff',
  },
  quantity: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    height: 25,
    width: 30,
    borderWidth: 1,
    borderColor: '#dee2e6',
    backgroundColor: '#ffffff',
    marginLeft: -1
  },
  deleteOrderItem: {
    top: 10,
    right: 10,
    position: 'absolute',
    color: 'red'
  },

  // react-native-collapsible
  collapsibleWrapper: {
    borderTopWidth: 8,
    borderColor: '#F0F4F7'
  },
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  collapsibleContent: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#CCC",
    backgroundColor: 'white',
    padding: 20,
  },
})