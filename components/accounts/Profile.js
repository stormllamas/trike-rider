import React, { useEffect, useState, useRef } from 'react';
import { useBackButton } from '../common/BackButtonHandler';

import { connect } from 'react-redux';
import PropTypes from 'prop-types'

import { Icon, Text, Button, IndexPath, Select, SelectItem, Spinner, Input } from '@ui-kitten/components';
import { View, ScrollView } from 'react-native'

import Header from '../layout/Header'

import FontAwesome from 'react-native-vector-icons/dist/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons';

import { styles } from '../common/Styles'

import { reroute, updateUser } from '../../actions/auth'


const Profile = ({
  auth: { userLoading, user, isAuthenticated },
  updateUser,
  
  reroute,
  navigation
}) => {

  // Loading State
  const [updatingUser, setUpdatingUser] = useState(false);

  // State for user update
  const [editingProfile, setEditingProfile] = useState(false);
  const [firstName, setFirstName] = useState(user ? (user.first_name ? user.first_name : '') : '');
  const [lastName, setLastName] = useState(user ? (user.last_name ? user.last_name : '') : '');
  const [contact, setContact] = useState(user ? (user.contact ? user.contact : '') : '');
  const [gender, setGender] = useState(user ? (user.gender ? user.gender : '') : '');
  const [selectedGenderIndex, setSelectedGenderIndex] = useState(new IndexPath(0));

  const mapRef = useRef();
  
  const handleBackButtonClick = () => {
    // navigation.goBack()
    navigation.navigate('Root', {screen: 'Food'})
    return true
  }
  useBackButton(handleBackButtonClick)

  const saveUserChanges = async () => {
    setUpdatingUser(true)
    const body = {
      username: user.username,
      first_name: firstName,
      last_name: lastName,
      contact: contact,
      gender: selectedGenderIndex === 0 ? 'male' : 'female'
    }
    await updateUser(body)
    setEditingProfile(false)
    setUpdatingUser(false)
  }
  
  const cancelEditing = () => {
    setFirstName(user.first_name)
    setLastName(user.last_name)
    setContact(user.contact)
    setSelectedGenderIndex(!user.gender ? new IndexPath(0) : (user.gender === 'male' ? new IndexPath(0) : new IndexPath(1)))
    setEditingProfile(false)
  }

  useEffect(() => {
    reroute({
      navigation,
      type: 'private',
      userLoading,
      isAuthenticated
    })
  }, [userLoading]);

  return (
    <>
      <Header subtitle='My Profile' navigation={navigation}/>
      {userLoading || updatingUser && (
        <View style={[styles.overlay, {backgroundColor:'transparent', opacity: 1, alignItems: 'center', justifyContent: 'center', zIndex: 11}]}>
          <Spinner size='large'/>
        </View>
      )}
      {isAuthenticated && user ? (
        <>
          <ScrollView style={{ flex: 1, padding: 15, backgroundColor: '#F8F8F8' }}>
            <Text style={{ fontSize: 24, fontWeight: '700', }}>My Profile</Text>
            <View style={{ marginBottom: 30, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 16 }}>{user.email}</Text>
            </View>
            <View style={[styles.inputGroup, { flexDirection: 'row' }]}>
              {!editingProfile ? (
                <Button style={{backgroundColor:"#03A9F4", borderColor: '#03A9F4', alignSelf:'flex-start', marginBottom: 25 }} onPress={() => setEditingProfile(true)}>EDIT PROFILE</Button>
              ) : (
                <>
                  <Button style={{backgroundColor:"#66BB6A", borderColor: "#66BB6A", alignSelf:'flex-start', marginBottom: 25, marginRight: 15 }} onPress={() => saveUserChanges()}>SAVE CHANGES</Button>
                  <Button style={{backgroundColor:"#FF5858", borderColor: "#FF5858", alignSelf:'flex-start', marginBottom: 25 }} onPress={() => cancelEditing()}>CANCEL</Button>
                </>
              )}
            </View>
            <View style={[styles.inputGroup, { flexDirection: 'row' }]}>
              <Input
                value={editingProfile ? firstName : user.first_name}
                label='First Name'
                placeholder='First Name'
                disabled={editingProfile ? false : true}
                onChangeText={nextValue => setFirstName(nextValue)}
                style={{ flex: 1, margin: 4 }}
              />
              <Input
                value={editingProfile ? lastName : user.last_name}
                label='Last Name'
                placeholder='Last Name'
                disabled={editingProfile ? false : true}
                onChangeText={nextValue => setLastName(nextValue)}
                style={{ flex: 1, margin: 4 }}
              />
            </View>
            <View style={styles.inputGroup}>
              <Input
                value={editingProfile ? contact : user.contact}
                onChangeText={nextValue => setContact(nextValue)}
                label='Contact'
                placeholder='Enter Your Contact'
                disabled={editingProfile ? false : true}
                accessoryLeft={props => <FontAwesome name='phone' size={22} color={"#03A9F4"}/>}
                caption='We use this to inform you about your order'
                captionIcon={props => <Icon {...props} name='alert-circle-outline'/>}
              />
            </View>
            <View style={{ marginBottom: 20 }}>
              <Select
                value={editingProfile ? (selectedGenderIndex.row == 0 ? 'Male' : 'Female') : (!user.gender ? 'Male' : (selectedGenderIndex.row == 0 ? 'Male' : 'Female'))}
                selectedIndex={selectedGenderIndex}
                disabled={editingProfile ? false : true}
                label='Gender'
                accessoryLeft={props => <FontAwesome name="transgender" size={22} color={"#03A9F4"}/>}
                placeholder='Select a Gender'
                onSelect={index => setSelectedGenderIndex(index)}>
                <SelectItem title='Male'/>
                <SelectItem title='Female'/>
              </Select>
            </View>
          </ScrollView>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

Profile.propTypes = {
  reroute: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {reroute, updateUser})(Profile);