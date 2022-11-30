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
import getIncidentById from '../api/getIncidentById'
import { toJpeg } from 'html-to-image'
import { toast } from 'react-toastify'

function IncidentUpdate() {
  // SEND GET INCIDENT REQUEST
  const ROUTE = useParams()
  const Incident = getIncidentById(ROUTE.incident_id)

  // INFORMATION STATE
  const Account = React.useContext(AccountContext)
  const [status, setStatus] = React.useState('loading')
  const [helper, setHelper] = React.useState({})
  const [error, setError] = React.useState({})

  // INPUT STATE
  // 1. INCIDENT RESPONSE
  const [date_called, setDateCalled] = React.useState('')
  const [time_called, setTimeCalled] = React.useState('')
  const [name_of_caller, setNameOfCaller] = React.useState('')
  const [caller_contact_number, setCallerContactNumber] = React.useState('')
  const [team_responded, setTeamResponded] = React.useState('')
  const [vehicle_responded, setVehicleResponded] = React.useState('')
  // 2. INCIDENT INFORMATION
  const [type_trauma, setTypeTrauma] = React.useState(false)
  const [type_medical, setTypeMedical] = React.useState(false)
  const [type_obstetric, setTypeObstetric] = React.useState(false)
  const [type_transfer, setTypeTransfer] = React.useState(false)
  const [type_vehicular, setTypeVehicular] = React.useState(false)
  const [type_others, setTypeOthers] = React.useState(false)
  const [type_other_specify, setTypeOtherSpecify] = React.useState('')
  const [name_of_incident, setNameOfIncident] = React.useState('')
  const [vehicle_hatchback, setVehicleHatchback] = React.useState('')
  const [vehicle_sedan, setVehicleSedan] = React.useState('')
  const [vehicle_suv, setVehicleSuv] = React.useState('')
  const [vehicle_van, setVehicleVan] = React.useState('')
  const [vehicle_pickup, setVehiclePickup] = React.useState('')
  const [vehicle_motorcycle, setVehicleMotorcycle] = React.useState('')
  const [municipality, setMunicipality] = React.useState('')
  const [barangay, setBarangay] = React.useState('')
  const [purok, setPurok] = React.useState('')
  const [latitude, setLatitude] = React.useState('')
  const [longitude, setLongitude] = React.useState('')
  const [date_of_incident, setDateOfIncident] = React.useState('')
  const [time_of_incident, setTimeOfIncident] = React.useState('')

  // ON FETCH INCIDENT
  React.useEffect(() => {
    if (Incident.loading) setStatus('loading')
    if (Incident.error) setStatus('error')
    if (Incident.data) {
      let i = {
        name: '',
        types: '',
        types_ex: '',
        municipal: '',
        barangay: '',
        purok: '',
        latitude: '',
        longitude: '',
        caller_name: '',
        caller_number: '',
        response_team: '',
        response_vehicle: '',
        involved_vehicle_motorcycle: '',
        involved_vehicle_hatchback: '',
        involved_vehicle_sedan: '',
        involved_vehicle_suv: '',
        involved_vehicle_van: '',
        involved_vehicle_pickup: '',
        called_at: '',
        occured_at: ''
      }
      i = Incident.data
      setStatus('success')
      setDateCalled(Help.setDate(i.called_at))
      setTimeCalled(Help.setTime(i.called_at))
      setNameOfCaller(Help.setText(i.caller_name))
      setCallerContactNumber(Help.setText(i.caller_number))
      setTeamResponded(Help.setText(i.response_team))
      setVehicleResponded(Help.setText(i.response_vehicle))
      setTypeTrauma(Help.findInArray(i.types, 'trauma'))
      setTypeMedical(Help.findInArray(i.types, 'medical'))
      setTypeObstetric(Help.findInArray(i.types, 'obstetric'))
      setTypeTransfer(Help.findInArray(i.types, 'transfer'))
      setTypeVehicular(Help.findInArray(i.types, 'vehicular'))
      setTypeOthers(Help.findInArray(i.types, 'other'))
      setTypeOtherSpecify(Help.setText(i.types_ex))
      setNameOfIncident(Help.setText(i.name))
      setVehicleHatchback(Help.setNumber(i.involved_vehicle_hatchback))
      setVehicleSedan(Help.setNumber(i.involved_vehicle_sedan))
      setVehicleSuv(Help.setNumber(i.involved_vehicle_suv))
      setVehicleVan(Help.setNumber(i.involved_vehicle_van))
      setVehiclePickup(Help.setNumber(i.involved_vehicle_pickup))
      setVehicleMotorcycle(Help.setNumber(i.involved_vehicle_motorcycle))
      setMunicipality(Help.setText(i.municipal))
      setBarangay(Help.setText(i.barangay))
      setPurok(Help.setText(i.purok))
      setLatitude(Help.setNumber(i.latitude))
      setLongitude(Help.setNumber(i.longitude))
      setDateOfIncident(Help.setDate(i.occured_at))
      setTimeOfIncident(Help.setTime(i.occured_at))
    }

    return () => setStatus('loading')
  }, [Incident.loading, Incident.error, Incident.data])

  // SEND UPDATE INCIDENT REQUEST
  function submitForm(e) {
    e.preventDefault()
    setStatus('loading')

    const URL = process.env.BASE_URL + '/incidents/' + ROUTE.incident_id
    const DATA = {
      name: Help.formInputText(name_of_incident),
      types: [
        type_trauma && 'trauma',
        type_medical && 'medical',
        type_obstetric && 'obstetric',
        type_transfer && 'transfer',
        type_vehicular && 'vehicular',
        type_others && 'other'
      ].filter(Boolean),
      types_ex: Help.formInputText(type_other_specify),
      municipal: Help.formInputText(municipality),
      barangay: Help.formInputText(barangay),
      purok: Help.formInputText(purok),
      latitude: Help.formInputNumber(latitude),
      longitude: Help.formInputNumber(longitude),
      caller_name: Help.formInputText(name_of_caller),
      caller_number: Help.formInputText(caller_contact_number),
      response_team: Help.formInputText(team_responded),
      response_vehicle: Help.formInputText(vehicle_responded),
      involved_vehicle_motorcycle: Help.formInputNumber(vehicle_motorcycle),
      involved_vehicle_hatchback: Help.formInputNumber(vehicle_hatchback),
      involved_vehicle_sedan: Help.formInputNumber(vehicle_sedan),
      involved_vehicle_suv: Help.formInputNumber(vehicle_suv),
      involved_vehicle_van: Help.formInputNumber(vehicle_van),
      involved_vehicle_pickup: Help.formInputNumber(vehicle_pickup),
      called_at: Help.formInputDateTime(date_called, time_called),
      occured_at: Help.formInputDateTime(date_of_incident, time_of_incident)
    }
    const CONFIG = { headers: { Authorization: `Bearer ${localStorage.getItem('q-drr-web-token')}` } }

    axios
      .patch(URL, DATA, CONFIG)
      .then((response) => {
        setStatus('success')
        if (response.status === 201) {
          toast.success('Incident record has beed updated')
          navigate('/incidents/records/' + ROUTE.incident_id, { replace: true })
        }
      })
      .catch((error) => {
        setStatus('success')
        if (error.response) {
          if (error.response?.status === 400) {
            setHelper(error.response.data)
            setError(error.response.data)
          } else if (error.response?.status === 403) toast.error('User credential is forbidden')
          else if (error.response?.status === 404) toast.error('Incident record was not found')
          else if (error.response?.status === 500) toast.error('Unexpected server error')
        } else if (error.request) console.error(error.request)
        else console.error('Error', error.message)
      })
  }

  return (
    <PageContent>
      <FadeAnimation>
        <Form status={status}>
          <SectionHeader bigTitle="Update Incident Rescue">
            <ButtonIcon
              color="gray"
              label="Back to Incident Rescue Information"
              onClick={() => navigate(`/incidents/records/${ROUTE.incident_id}`, { replace: true })}
              status={status}
              title="Close this form">
              <ArrowLeft20 />
            </ButtonIcon>
          </SectionHeader>
          <SectionHeader title="1. Incident Response" />
          <FormRow>
            <Field error={helper.called_at} label="Date Called" status={status}>
              <Input onChange={(e) => setDateCalled(e.target.value)} value={date_called} uppercase required type="date" />
            </Field>
            <Field error={helper.called_at} label="Time Called" status={status}>
              <Input onChange={(e) => setTimeCalled(e.target.value)} value={time_called} uppercase required type="time" />
            </Field>
          </FormRow>
          <FormRow>
            <Field error={helper.caller_name} label="Name of Caller" status={status}>
              <Input uppercase onChange={(e) => setNameOfCaller(e.target.value)} required size={30} type="text" value={name_of_caller} />
            </Field>
            <Field error={helper.caller_number} label="Caller Contact #" status={status}>
              <Input
                uppercase
                onChange={(e) => setCallerContactNumber(e.target.value)}
                required
                size={30}
                type="text"
                value={caller_contact_number}
              />
            </Field>
          </FormRow>
          <FormRow>
            <Field error={helper.response_team} label="Team Responded">
              <Select onChange={(e) => setTeamResponded(e.target.value)} value={team_responded} required>
                <option></option>
                <option value="ALPHA">ALPHA</option>
                <option value="BRAVO">BRAVO</option>
                <option value="CHARLIE">CHARLIE</option>
                <option value="DELTA">DELTA</option>
              </Select>
            </Field>
            <Field error={helper.response_vehicle} label="Vehicle Responded">
              <Select onChange={(e) => setVehicleResponded(e.target.value)} value={vehicle_responded}>
                <option></option>
                <option value="AMBULANCE VICKY">AMBULANCE VICKY</option>
                <option value="AMBULANCE ANGELA">AMBULANCE ANGELA</option>
                <option value="MOTOMEDIC">MOTOMEDIC</option>
              </Select>
            </Field>
          </FormRow>
          <SectionHeader title="2. Incident Information" />
          <div className="sub-section-header">2.1 Type of Incident</div>
          {helper.types && (
            <FormRow>
              <Field error={helper.types} />
            </FormRow>
          )}
          <FormRow status={status}>
            <Checkbox checked={type_trauma} onChange={(e) => setTypeTrauma(e.target.checked)} text="Trauma" />
            <Checkbox checked={type_medical} onChange={(e) => setTypeMedical(e.target.checked)} text="Medical" />
            <Checkbox checked={type_obstetric} onChange={(e) => setTypeObstetric(e.target.checked)} text="Obstetric" />
            <Checkbox checked={type_transfer} onChange={(e) => setTypeTransfer(e.target.checked)} text="Transfer" />
            <Checkbox checked={type_vehicular} onChange={(e) => setTypeVehicular(e.target.checked)} text="Vehicular" />
            <Checkbox checked={type_others} onChange={(e) => setTypeOthers(e.target.checked)} text="Other" />
          </FormRow>
          {type_others && (
            <FormRow>
              <Field label="For other type, please specify" status={status}>
                <Input onChange={(e) => setTypeOtherSpecify(e.target.value)} value={type_other_specify} uppercase required />
              </Field>
            </FormRow>
          )}
          <div className="sub-section-header">2.2 Name of Incident</div>
          <FormRow>
            <Field error={helper.name} status={status}>
              <Input uppercase onChange={(e) => setNameOfIncident(e.target.value)} required size={30} type="text" value={name_of_incident} />
            </Field>
          </FormRow>
          <div className="sub-section-header">2.3 Vehicle/s Involved</div>
          <FormRow>
            <Field label="Hatchback">
              <Cleave
                onChange={(e) => setVehicleHatchback(e.target.value)}
                value={vehicle_hatchback}
                className="input"
                options={{
                  numeral: true,
                  numeralIntegerScale: 3,
                  numeralDecimalScale: 0,
                  numeralPositiveOnly: true
                }}
                placeholder="Total"
                size={10}
              />
            </Field>
            <Field label="Sedan">
              <Cleave
                onChange={(e) => setVehicleSedan(e.target.value)}
                value={vehicle_sedan}
                className="input"
                options={{
                  numeral: true,
                  numeralIntegerScale: 3,
                  numeralDecimalScale: 0,
                  numeralPositiveOnly: true
                }}
                placeholder="Total"
                size={10}
              />
            </Field>
            <Field label="SUV">
              <Cleave
                onChange={(e) => setVehicleSuv(e.target.value)}
                value={vehicle_suv}
                className="input"
                options={{
                  numeral: true,
                  numeralIntegerScale: 3,
                  numeralDecimalScale: 0,
                  numeralPositiveOnly: true
                }}
                placeholder="Total"
                size={10}
              />
            </Field>
            <Field label="Pickup">
              <Cleave
                onChange={(e) => setVehiclePickup(e.target.value)}
                value={vehicle_pickup}
                className="input"
                options={{
                  numeral: true,
                  numeralIntegerScale: 3,
                  numeralDecimalScale: 0,
                  numeralPositiveOnly: true
                }}
                placeholder="Total"
                size={10}
              />
            </Field>
            <Field label="Van">
              <Cleave
                onChange={(e) => setVehicleVan(e.target.value)}
                value={vehicle_van}
                className="input"
                options={{
                  numeral: true,
                  numeralIntegerScale: 3,
                  numeralDecimalScale: 0,
                  numeralPositiveOnly: true
                }}
                placeholder="Total"
                size={10}
              />
            </Field>
            <Field label="Motorcycle">
              <Cleave
                onChange={(e) => setVehicleMotorcycle(e.target.value)}
                value={vehicle_motorcycle}
                className="input"
                options={{
                  numeral: true,
                  numeralIntegerScale: 3,
                  numeralDecimalScale: 0,
                  numeralPositiveOnly: true
                }}
                placeholder="Total"
                size={10}
              />
            </Field>
          </FormRow>
          <FormRow>
            <Field error={helper.municipal} label="Municipality" status={status}>
              <Select
                onChange={(e) => {
                  setBarangay('')
                  setMunicipality(e.target.value)
                }}
                value={municipality}>
                <option value=""></option>
                {Address.Municipalities('02', 'QUIRINO').map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </Field>
            <Field error={helper.barangay} label="Barangay" status={status}>
              <Select onChange={(e) => setBarangay(e.target.value)} value={barangay}>
                <option value=""></option>
                {Address.Barangays('02', 'QUIRINO', municipality).map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </Field>
            <Field error={helper.purok} label="Purok/Street" status={status}>
              <Input uppercase onChange={(e) => setPurok(e.target.value)} size={13} type="text" value={purok} />
            </Field>
          </FormRow>
          <FormRow>
            <Field error={helper.latitude} label="Latitude" status={status}>
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
            <Field error={helper.longitude} label="Longitude" status={status}>
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
          <FormRow>
            <Field error={helper.occured_at} label="Date of Incident" status={status}>
              <Input onChange={(e) => setDateOfIncident(e.target.value)} value={date_of_incident} uppercase required type="date" />
            </Field>
            <Field error={helper.occured_at} label="Time of Incident" status={status}>
              <Input onChange={(e) => setTimeOfIncident(e.target.value)} value={time_of_incident} uppercase required type="time" />
            </Field>
          </FormRow>
          <FormError error={error} />
          <FormFooter>
            <Button
              disabled={status === 'loading'}
              loadingText="Updating..."
              onClick={submitForm}
              status={status}
              title="Update existing incident record"
              type="submit">
              Update Incident Record
            </Button>
          </FormFooter>
        </Form>
      </FadeAnimation>
    </PageContent>
  )
}

export default IncidentUpdate
