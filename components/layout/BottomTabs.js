import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';

import { View, StyleSheet } from 'react-native'
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome'
import { BottomNavigation, BottomNavigationTab, Layout } from '@ui-kitten/components';

const BottomTabs = ({
  auth: {current, all_subjects},
  setCurrentTab,
  navigation,
}) => {

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onTabSelect = index => {
    setSelectedIndex(index)
    if (index == 0) {
      setCurrentTab({ mode: 'unclaimed', claimed: false, pickedup: false, delivered: false })
    } else if (index == 1) {
      setCurrentTab({ mode: 'claimed', claimed: true, pickedup: false, delivered: false })
    } else if (index == 2) {
      setCurrentTab({ mode: 'undelivered', claimed: true, pickedup: true, delivered: false })
    } else if (index == 3) {
      setCurrentTab({ mode: 'delivered', claimed: true, pickedup: true, delivered: true })
    }
  }

  // useEffect(() => {
  //   if (screen == 'Unclaimed') {
  //     setSelectedIndex(0)
  //   } else if (screen == 'Claimed') {
  //     setSelectedIndex(1)
  //     setCurrentTab({ claimed: true, pickedup: false, delivered: false })
  //   }
  // }, [screen]);

  return (
    <Layout>
      <BottomNavigation
        selectedIndex={selectedIndex}
        onSelect={index => onTabSelect(index)}>
        <BottomNavigationTab icon={props => <FontAwesome name="list" size={20} color={selectedIndex == 0 ? "#FAA634":"#909CB4"}/>} title='UNCLAIMED'/>
        <BottomNavigationTab icon={props => <FontAwesome name="archive" size={20} color={selectedIndex == 1 ? "#FAA634":"#909CB4"}/>} title='CLAIMED'/>
        <BottomNavigationTab icon={props => <FontAwesome name="motorcycle" size={20} color={selectedIndex == 2 ? "#FAA634":"#909CB4"}/>} title='UNDELIVERED'/>
        <BottomNavigationTab icon={props => <FontAwesome name="check" size={20} color={selectedIndex == 3 ? "#FAA634":"#909CB4"}/>} title='DELIVERED'/>
      </BottomNavigation>
    </Layout>
  )
}


const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(BottomTabs);