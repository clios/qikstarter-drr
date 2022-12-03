import { ArrowLeft20, Information24 } from '@carbon/icons-react'
import { navigate, useParams } from '@reach/router'

import AccountContext from '../contexts/AccountContext'
import Address from '../Address'
import Authorization from '../components/Authorization'
import Button from '../components/Button'
import ButtonIcon from '../components/ButtonIcon'
import Checkbox from '../components/Checkbox'
import Cleave from 'cleave.js/react'
import { Entropy } from 'entropy-string'
import FadeAnimation from '../components/FadeAnimation'
import Field from '../components/Field'
import Form from '../components/Form'
import FormError from '../components/FormError'
import FormFooter from '../components/FormFooter'
import FormRow from '../components/FormRow'
import Help from '../Help'
import Input from '../components/Input'
import PageContent from '../components/PageContent'
import React from 'react'
import SectionBody from '../components/SectionBody'
import SectionHeader from '../components/SectionHeader'
import Select from '../components/Select'
import VicinityChecker from '../components/VicinityChecker'
import axios from 'axios'
import { confirmAlert } from 'react-confirm-alert'
import getEvacuationCenterById from '../api/getEvacuationCenterById'
import getIncidentById from '../api/getIncidentById'
import { toJpeg } from 'html-to-image'
import { toast } from 'react-toastify'

function EvacuationCenterUpdate() {
  //  SEND GET EVACUATION CENTER REQUEST
  const ROUTE = useParams()
  const EvacuationCenter = getEvacuationCenterById(ROUTE.evacuation_center_id)

  // INFORMATION STATE
  const Account = React.useContext(AccountContext)
  const [status, setStatus] = React.useState('success')
  const [error, setError] = React.useState({})

  // INPUT STATE
  const [name, setName] = React.useState('')
  const [capacity, setCapacity] = React.useState('')
  const [municipal, setMunicipal] = React.useState('')
  const [barangay, setBarangay] = React.useState('')
  const [purok, setPurok] = React.useState('')
  const [latitude, setLatitude] = React.useState('')
  const [longitude, setLongitude] = React.useState('')
  const [facility_backup_power_source, setFacilityBackupPowerSource] = React.useState(false)
  const [facility_breastfeeding, setFacilityBreastfeeding] = React.useState(false)
  const [facility_clinic, setFacilityClinic] = React.useState(false)
  const [facility_communication_room, setFacilityCommunicationRoom] = React.useState(false)
  const [facility_council, setFacilityCouncil] = React.useState(false)
  const [facility_couples_room, setFacilityCouplesRoom] = React.useState(false)
  const [facility_dining, setFacilityDining] = React.useState(false)
  const [facility_distilation_area, setFacilityDistilationArea] = React.useState(false)
  const [facility_electrical_room, setFacilityElectricalRoom] = React.useState(false)
  const [facility_kitchen, setFacilityKitchen] = React.useState(false)
  const [facility_laundry_area, setFacilityLaundryArea] = React.useState(false)
  const [facility_pharmacy, setFacilityPharmacy] = React.useState(false)
  const [facility_play_room, setFacilityPlayRoom] = React.useState(false)
  const [facility_registration_area, setFacilityRegistrationArea] = React.useState(false)
  const [facility_rest_room, setFacilityRestRoom] = React.useState(false)
  const [facility_water_station, setFacilityWaterStation] = React.useState(false)
  const [is_government_owned, setIsGovernmentOwned] = React.useState(true)

  // ON FETCH EVACUATION CENTER
  React.useEffect(() => {
    if (EvacuationCenter.loading) setStatus('loading')
    if (EvacuationCenter.error) setStatus('error')
    if (EvacuationCenter.data) {
      let ec = {
        name: '',
        capacity: '',
        municipal: '',
        barangay: '',
        purok: '',
        latitude: '',
        longitude: '',
        facility_backup_power_source: '',
        facility_breastfeeding: '',
        facility_clinic: '',
        facility_communication_room: '',
        facility_council: '',
        facility_couples_room: '',
        facility_dining: '',
        facility_distilation_area: '',
        facility_electrical_room: '',
        facility_kitchen: '',
        facility_laundry_area: '',
        facility_pharmacy: '',
        facility_play_room: '',
        facility_registration_area: '',
        facility_rest_room: '',
        facility_water_station: '',
        is_government_owned: ''
      }
      ec = EvacuationCenter.data
      setStatus('success')
      setName(Help.setText(ec.name))
      setCapacity(Help.setNumber(ec.capacity))
      setMunicipal(Help.setText(ec.municipal))
      setBarangay(Help.setText(ec.barangay))
      setPurok(Help.setText(ec.purok))
      setLatitude(Help.setNumber(ec.latitude))
      setLongitude(Help.setNumber(ec.longitude))
      setFacilityBackupPowerSource(Help.setBoolean(ec.facility_backup_power_source))
      setFacilityBreastfeeding(Help.setBoolean(ec.facility_breastfeeding))
      setFacilityClinic(Help.setBoolean(ec.facility_clinic))
      setFacilityCommunicationRoom(Help.setBoolean(ec.facility_communication_room))
      setFacilityCouncil(Help.setBoolean(ec.facility_council))
      setFacilityCouplesRoom(Help.setBoolean(ec.facility_couples_room))
      setFacilityDining(Help.setBoolean(ec.facility_dining))
      setFacilityDistilationArea(Help.setBoolean(ec.facility_distilation_area))
      setFacilityElectricalRoom(Help.setBoolean(ec.facility_electrical_room))
      setFacilityKitchen(Help.setBoolean(ec.facility_kitchen))
      setFacilityLaundryArea(Help.setBoolean(ec.facility_laundry_area))
      setFacilityPharmacy(Help.setBoolean(ec.facility_pharmacy))
      setFacilityPlayRoom(Help.setBoolean(ec.facility_play_room))
      setFacilityRegistrationArea(Help.setBoolean(ec.facility_registration_area))
      setFacilityRestRoom(Help.setBoolean(ec.facility_rest_room))
      setFacilityWaterStation(Help.setBoolean(ec.facility_water_station))
      setIsGovernmentOwned(Help.setBoolean(ec.is_government_owned))
    }

    return () => setStatus('loading')
  }, [EvacuationCenter.loading, EvacuationCenter.error, EvacuationCenter.data])

  // SEND UPDATE EVACUATION CENTER REQUEST
  function submitForm(e) {
    e.preventDefault()
    setStatus('loading')

    const URL = process.env.BASE_URL + '/evacuationCenters/' + ROUTE.evacuation_center_id
    const DATA = {
      name: Help.formInputText(name),
      capacity: Help.formInputNumber(capacity),
      municipal: Help.formInputText(municipal),
      barangay: Help.formInputText(barangay),
      purok: Help.formInputText(purok),
      latitude: Help.formInputNumber(latitude),
      longitude: Help.formInputNumber(longitude),
      facility_backup_power_source: facility_backup_power_source,
      facility_breastfeeding: facility_breastfeeding,
      facility_clinic: facility_clinic,
      facility_communication_room: facility_communication_room,
      facility_council: facility_council,
      facility_couples_room: facility_couples_room,
      facility_dining: facility_dining,
      facility_distilation_area: facility_distilation_area,
      facility_electrical_room: facility_electrical_room,
      facility_kitchen: facility_kitchen,
      facility_laundry_area: facility_laundry_area,
      facility_pharmacy: facility_pharmacy,
      facility_play_room: facility_play_room,
      facility_registration_area: facility_registration_area,
      facility_rest_room: facility_rest_room,
      facility_water_station: facility_water_station,
      is_government_owned: is_government_owned
    }
    const CONFIG = { headers: { Authorization: `Bearer ${localStorage.getItem('q-drr-web-token')}` } }

    axios
      .patch(URL, DATA, CONFIG)
      .then((response) => {
        setStatus('success')
        if (response.status === 201) {
          toast.success('Evacuation center record has beed updated')
          navigate('/evacuation/centers/' + ROUTE.evacuation_center_id, { replace: true })
        }
      })
      .catch((error) => {
        setStatus('success')
        if (error.response) {
          if (error.response?.status === 400) {
            setHelper(error.response.data)
            setError(error.response.data)
          } else if (error.response?.status === 403) toast.error('User credential is forbidden')
          else if (error.response?.status === 404) toast.error('Evacuation center record was not found')
          else if (error.response?.status === 500) toast.error('Unexpected server error')
        } else if (error.request) console.error(error.request)
        else console.error('Error', error.message)
      })
  }

  return (
    <PageContent>
      <FadeAnimation>
        <Form status={status}>
          <SectionHeader bigTitle="Update Evacuation Center Rescue">
            <ButtonIcon
              color="gray"
              label="Back to Evacuation Center Information"
              onClick={() => navigate(`/evacuation/centers/${ROUTE.evacuation_center_id}`, { replace: true })}
              status={status}
              title="Close this form">
              <ArrowLeft20 />
            </ButtonIcon>
          </SectionHeader>
          <SectionHeader title="1. Evacuation Center" />
          <FormRow>
            <Field error={error.name} label="Name of Evacuation Center" status={status}>
              <Input onChange={(e) => setName(e.target.value)} value={name} uppercase required size={30} type="text" />
            </Field>
            <Field error={error.capacity} label="Capacity">
              <Cleave
                onChange={(e) => setCapacity(e.target.value)}
                value={capacity}
                className="input"
                options={{
                  numeral: true,
                  numeralIntegerScale: 6,
                  numeralDecimalScale: 0,
                  numeralPositiveOnly: true,
                  numeralThousandsGroupStyle: 'thousand'
                }}
                size={10}
              />
            </Field>
            <Field label="Government Owned">
              <Checkbox onChange={(e) => setIsGovernmentOwned(e.target.checked)} checked={is_government_owned} text="Yes" />
            </Field>
          </FormRow>
          <FormRow>
            <Field error={error.municipal} label="Municipality" status={status}>
              <Select
                onChange={(e) => {
                  setBarangay('')
                  setMunicipal(e.target.value)
                }}
                value={municipal}>
                <option value=""></option>
                {Address.Municipalities('02', 'QUIRINO').map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </Field>
            <Field error={error.barangay} label="Barangay" status={status}>
              <Select onChange={(e) => setBarangay(e.target.value)} value={barangay}>
                <option value=""></option>
                {Address.Barangays('02', 'QUIRINO', municipal).map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </Field>
            <Field error={error.purok} label="Purok/Street" status={status}>
              <Input uppercase onChange={(e) => setPurok(e.target.value)} size={13} type="text" value={purok} />
            </Field>
          </FormRow>
          <FormRow>
            <Field error={error.latitude} label="Latitude" status={status}>
              <Cleave
                className="input"
                onChange={(e) => setLatitude(e.target.value)}
                size={20}
                type="text"
                options={{
                  numeral: true,
                  numeralIntegerScale: 2,
                  numeralDecimalScale: 15,
                  numeralThousandsGroupStyle: 'none'
                }}
                value={latitude}
              />
            </Field>
            <Field error={error.longitude} label="Longitude" status={status}>
              <Cleave
                className="input"
                onChange={(e) => setLongitude(e.target.value)}
                size={20}
                type="text"
                options={{
                  numeral: true,
                  numeralIntegerScale: 3,
                  numeralDecimalScale: 15,
                  numeralThousandsGroupStyle: 'none'
                }}
                value={longitude}
              />
            </Field>
          </FormRow>
          <SectionHeader title="2. Facilities" />
          <FormRow status={status}>
            <Checkbox
              onChange={(e) => setFacilityBackupPowerSource(e.target.checked)}
              checked={facility_backup_power_source}
              text="Backup Power Source"
            />
            <Checkbox onChange={(e) => setFacilityBreastfeeding(e.target.checked)} checked={facility_breastfeeding} text="Breastfeeding" />
            <Checkbox onChange={(e) => setFacilityClinic(e.target.checked)} checked={facility_clinic} text="Clinic" />
            <Checkbox
              onChange={(e) => setFacilityCommunicationRoom(e.target.checked)}
              checked={facility_communication_room}
              text="Communication Room"
            />
            <Checkbox onChange={(e) => setFacilityCouncil(e.target.checked)} checked={facility_council} text="Council" />
            <Checkbox onChange={(e) => setFacilityCouplesRoom(e.target.checked)} checked={facility_couples_room} text="Couples Room" />
            <Checkbox onChange={(e) => setFacilityDining(e.target.checked)} checked={facility_dining} text="Dining" />
            <Checkbox onChange={(e) => setFacilityDistilationArea(e.target.checked)} checked={facility_distilation_area} text="Distilation Area" />
            <Checkbox onChange={(e) => setFacilityElectricalRoom(e.target.checked)} checked={facility_electrical_room} text="Electrical Room" />
            <Checkbox onChange={(e) => setFacilityKitchen(e.target.checked)} checked={facility_kitchen} text="Kitchen" />
            <Checkbox onChange={(e) => setFacilityLaundryArea(e.target.checked)} checked={facility_laundry_area} text="Laundry Area" />
            <Checkbox onChange={(e) => setFacilityPharmacy(e.target.checked)} checked={facility_pharmacy} text="Pharmacy" />
            <Checkbox onChange={(e) => setFacilityPlayRoom(e.target.checked)} checked={facility_play_room} text="Play Room" />
            <Checkbox onChange={(e) => setFacilityRegistrationArea(e.target.checked)} checked={facility_registration_area} text="Registration Area" />
            <Checkbox onChange={(e) => setFacilityRestRoom(e.target.checked)} checked={facility_rest_room} text="Rest Room" />
            <Checkbox onChange={(e) => setFacilityWaterStation(e.target.checked)} checked={facility_water_station} text="Water Station" />
          </FormRow>
          <FormError error={error} />
          <FormFooter>
            <Button
              disabled={status === 'loading'}
              loadingText="Updating..."
              onClick={submitForm}
              status={status}
              title="Update existing evacuation center record"
              type="submit">
              Update Evacuation Center Record
            </Button>
          </FormFooter>
        </Form>
      </FadeAnimation>
    </PageContent>
  )
}

export default EvacuationCenterUpdate
