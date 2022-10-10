import { Redirect, Router } from '@reach/router'

import AgricultureLandslide from './pages/AgricultureLandslide'
import AgricultureTabs from './layouts/AgricultureTabs'
import PopulationDashboard from './pages/PopulationDashboard'
import PopulationTabs from './layouts/PopulationTabs'
import React from 'react'
import ResidentCreate from './pages/ResidentCreate'
import ResidentDashboard from './pages/ResidentDashboard'
import ResidentMap from './pages/ResidentMap'
import ResidentProfile from './pages/ResidentProfile'
import ResidentRecords from './pages/ResidentRecords'
import ResidentTabs from './layouts/ResidentTabs'
import ResidentUpdate from './pages/ResidentUpdate'
import SettlementAreaFlood from './pages/SettlementAreaFlood'
import SettlementAreaLandslide from './pages/SettlementAreaLandslide'
import SettlementAreaTabs from './layouts/SettlementAreaTabs'
import Sider from './layouts/Sider'
import SignIn from './pages/SignIn'
import UserCreate from './pages/UserCreate'
import UserProfile from './pages/UserProfile'
import UserRecords from './pages/UserRecords'
import UserTabs from './layouts/UserTabs'
import UserUpdate from './pages/UserUpdate'
import YourAccountProfile from './pages/YourAccountProfile'
import YourAccountTabs from './layouts/YourAccountTabs'
import YourAccountUpdate from './pages/YourAccountUpdate'

function Routes() {
  return (
    <Router>
      <SignIn path="/" />
      <Sider path="/">
        <Redirect from="/your-account" to="/your-account/information" noThrow />
        <YourAccountTabs path="your-account">
          <YourAccountProfile path="/information" />
          <YourAccountUpdate path="/information/edit" />
        </YourAccountTabs>

        <Redirect from="/settlement-area" to="/settlement-area/landslide" noThrow />
        <SettlementAreaTabs path="settlement-area">
          <SettlementAreaLandslide path="/landslide" />
          <SettlementAreaFlood path="/flood" />
        </SettlementAreaTabs>

        <Redirect from="/population" to="/population/dashboard" noThrow />
        <PopulationTabs path="population">
          <PopulationDashboard path="/dashboard" />
        </PopulationTabs>

        <Redirect from="/agriculture" to="/agriculture/landslide" noThrow />
        <AgricultureTabs path="agriculture">
          <AgricultureLandslide path="/landslide" />
        </AgricultureTabs>

        <Redirect from="/residents" to="/residents/dashboard" noThrow />
        <ResidentTabs path="residents">
          <ResidentDashboard path="/dashboard" />
          <ResidentRecords path="/records" />
          <ResidentCreate path="/records/add" />
          <ResidentProfile path="/records/:resident_id" />
          <ResidentUpdate path="/records/:resident_id/edit" />
          <ResidentMap path="/map" />
        </ResidentTabs>

        <Redirect from="/users" to="/users/records" noThrow />
        <UserTabs path="users">
          <UserRecords path="/records" />
          <UserCreate path="/records/add" />
          <UserProfile path="/records/:user_id" />
          <UserUpdate path="/records/:user_id/edit" />
        </UserTabs>
      </Sider>
    </Router>
  )
}

export default Routes
