import { Redirect, Router } from '@reach/router'

import EvacuationCenterInformation from './pages/EvacuationCenterInformation'
import EvacuationCenterMap from './pages/EvacuationCenterMap'
import EvacuationCenterRecords from './pages/EvacuationCenterRecords'
import EvacuationDashboard from './pages/EvacuationDashboard'
import EvacuationTabs from './layouts/EvacuationTabs'
import IncidentCreate from './pages/IncidentCreate'
import IncidentDashboard from './pages/IncidentDashboard'
import IncidentInformation from './pages/IncidentInformation'
import IncidentRecords from './pages/IncidentRecords'
import IncidentTabs from './layouts/IncidentTabs'
import IncidentUpdate from './pages/IncidentUpdate'
import PopulationDashboard from './pages/PopulationDashboard'
import PopulationTabs from './layouts/PopulationTabs'
import React from 'react'
import Sider from './layouts/Sider'
import SignIn from './pages/SignIn'
import UserCreate from './pages/UserCreate'
import UserProfile from './pages/UserProfile'
import UserRecords from './pages/UserRecords'
import UserTabs from './layouts/UserTabs'
import UserUpdate from './pages/UserUpdate'
import VRIFlood from './pages/VRIFlood'
import VRILandslide from './pages/VRILandslide'
import VRITabs from './layouts/VRITabs'
import VictimCreate from './pages/VictimCreate'
import VictimInformation from './pages/VictimInformation'
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

        <Redirect from="/vri" to="/vri/landslide" noThrow />
        <VRITabs path="vri">
          <VRILandslide path="/landslide" />
          <VRIFlood path="/flood" />
        </VRITabs>

        <Redirect from="/population" to="/population/dashboard" noThrow />
        <PopulationTabs path="population">
          <PopulationDashboard path="/dashboard" />
        </PopulationTabs>

        <Redirect from="/incidents" to="/incidents/dashboard" noThrow />
        <IncidentTabs path="incidents">
          <IncidentDashboard path="/dashboard" />
          <IncidentRecords path="/records" />
          <IncidentInformation path="/records/:incident_id" />
          <IncidentCreate path="/records/add" />
          <IncidentUpdate path="/records/:incident_id/edit" />
          <VictimCreate path="/records/:incident_id/victims/add" />
          <VictimInformation path="/records/:incident_id/victims/:victim_id" />
        </IncidentTabs>

        <Redirect from="/evacuation" to="/evacuation/dashboard" noThrow />
        <EvacuationTabs path="/evacuation">
          <EvacuationDashboard path="/dashboard" />
          <EvacuationCenterRecords path="/centers" />
          <EvacuationCenterInformation path="/centers/:evacuation_center_id" />
          <EvacuationCenterMap path="/map" />
        </EvacuationTabs>

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
