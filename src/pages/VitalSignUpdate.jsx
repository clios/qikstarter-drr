import { navigate, useParams } from '@reach/router'

import Account from '../json/account.json'
import AccountContext from '../contexts/AccountContext'
import Address from '../Address'
import { ArrowLeft20 } from '@carbon/icons-react'
import Authorization from '../components/Authorization'
import Button from '../components/Button'
import ButtonIcon from '../components/ButtonIcon'
import Checkbox from '../components/Checkbox'
import Cleave from 'cleave.js/react'
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
import SectionHeader from '../components/SectionHeader'
import Select from '../components/Select'
import Textarea from '../components/Textarea'
import axios from 'axios'
import getVitalSignById from '../api/getVitalSignById'
import { toast } from 'react-toastify'

function VitalSignUpdate() {
  // SEND GET VITAL SIGN REQUEST
  const ROUTE = useParams()
  const VitalSign = getVitalSignById(ROUTE.vital_sign_id)

  // INFORMATION STATE
  const Account = React.useContext(AccountContext)
  const [status, setStatus] = React.useState('success')
  const [helper, setHelper] = React.useState({})
  const [error, setError] = React.useState({})

  // INPUT STATE
  const [airway, setAirway] = React.useState('')
  const [respiratory_rate, setRespiratoryRate] = React.useState('')
  const [pulse_rate, setPulseRate] = React.useState('')
  const [systolic, setSystolic] = React.useState('')
  const [diastolic, setDiastolic] = React.useState('')
  const [recorded_date, setRecordedDate] = React.useState('')
  const [recorded_time, setRecordedTime] = React.useState('')

  // ON FETCH VITAL SIGN
  React.useEffect(() => {
    if (VitalSign.loading) setStatus('loading')
    if (VitalSign.error) setStatus('error')
    if (VitalSign.data) {
      let vs = {
        id: null,
        victim_id: null,
        airway: null,
        respiratory_rate: null,
        pulse_rate: null,
        systolic: null,
        diastolic: null,
        recorded_at: null,
        created_at: null,
        updated_at: null
      }
      vs = VitalSign.data
      setStatus('success')
      setAirway(Help.setText(vs.airway))
      setRespiratoryRate(Help.setNumber(vs.respiratory_rate))
      setPulseRate(Help.setNumber(vs.pulse_rate))
      setSystolic(Help.setNumber(vs.systolic))
      setDiastolic(Help.setNumber(vs.diastolic))
      setRecordedDate(Help.setDate(vs.recorded_at))
      setRecordedTime(Help.setTime(vs.recorded_at))
    }

    return () => setStatus('loading')
  }, [VitalSign.loading, VitalSign.error, VitalSign.data])

  // SEND UPDATE VICTIM REQUEST
  function submitForm(e) {
    e.preventDefault()
    setStatus('loading')

    const URL = process.env.BASE_URL + '/vitalSigns/' + ROUTE.vital_sign_id
    const DATA = {
      victim_id: Help.formInputNumber(ROUTE.victim_id),
      airway: Help.formInputText(airway),
      respiratory_rate: Help.formInputNumber(respiratory_rate),
      pulse_rate: Help.formInputNumber(pulse_rate),
      systolic: Help.formInputNumber(systolic),
      diastolic: Help.formInputNumber(diastolic),
      recorded_at: Help.formInputDateTime(recorded_date, recorded_time)
    }
    const CONFIG = { headers: { Authorization: `Bearer ${localStorage.getItem('q-drr-web-token')}` } }

    axios
      .patch(URL, DATA, CONFIG)
      .then((response) => {
        setStatus('success')
        if (response.status === 201) {
          toast.success('Vital sign record has been updated')
          navigate(`/incidents/records/${ROUTE.incident_id}/victims/${ROUTE.victim_id}`, { replace: true })
        }
      })
      .catch((error) => {
        setStatus('success')
        if (error.response) {
          if (error.response?.status === 400) {
            setHelper(error.response.data)
            setError(error.response.data)
          } else if (error.response?.status === 403) toast.error('User credential is forbidden')
          else if (error.response?.status === 404) toast.error('Victim record was not found')
          else if (error.response?.status === 500) toast.error('Unexpected server error')
        } else if (error.request) console.error(error.request)
        else console.error('Error', error.message)
      })
  }

  return (
    <PageContent>
      <FadeAnimation>
        <Form status={status}>
          <SectionHeader bigTitle="Update Vital Sign Record">
            <ButtonIcon
              color="gray"
              label="Back to Victim Information"
              onClick={() => navigate(`/incidents/records/${ROUTE.incident_id}/victims/${ROUTE.victim_id}`, { replace: true })}
              status={status}
              title="Close this form">
              <ArrowLeft20 />
            </ButtonIcon>
          </SectionHeader>
          <FormRow>
            <Field label="Date" status={status}>
              <Input onChange={(e) => setRecordedDate(e.target.value)} uppercase required type="date" value={recorded_date} />
            </Field>
            <Field label="Time" status={status}>
              <Input onChange={(e) => setRecordedTime(e.target.value)} uppercase required type="time" value={recorded_time} />
            </Field>
          </FormRow>
          <FormRow>
            <Field error={error.airway} label="Airway">
              <Select onChange={(e) => setAirway(e.target.value)} value={airway}>
                <option></option>
                <option value="clear">Clear</option>
                <option value="obstructed">Obstructed</option>
              </Select>
            </Field>
            <Field label="Respiratory Rate">
              <Cleave
                onChange={(e) => setRespiratoryRate(e.target.value)}
                value={respiratory_rate}
                className="input"
                options={{
                  numeral: true,
                  numeralIntegerScale: 3,
                  numeralDecimalScale: 0,
                  numeralPositiveOnly: true
                }}
                placeholder="CPM"
                size={10}
              />
            </Field>
            <Field label="Pulse/Heart Rate">
              <Cleave
                onChange={(e) => setPulseRate(e.target.value)}
                value={pulse_rate}
                className="input"
                options={{
                  numeral: true,
                  numeralIntegerScale: 3,
                  numeralDecimalScale: 0,
                  numeralPositiveOnly: true
                }}
                placeholder="BPM"
                size={10}
              />
            </Field>
          </FormRow>
          <FormRow>
            <Field label="Blood Pressure">
              <Cleave
                onChange={(e) => setSystolic(e.target.value)}
                value={systolic}
                className="input"
                options={{
                  numeral: true,
                  numeralIntegerScale: 3,
                  numeralDecimalScale: 0,
                  numeralPositiveOnly: true
                }}
                placeholder="SYSTOLIC"
                size={10}
              />
            </Field>
            <Field label="Blood Pressure">
              <Cleave
                onChange={(e) => setDiastolic(e.target.value)}
                value={diastolic}
                className="input"
                options={{
                  numeral: true,
                  numeralIntegerScale: 3,
                  numeralDecimalScale: 0,
                  numeralPositiveOnly: true
                }}
                placeholder="DIASTOLIC"
                size={10}
              />
            </Field>
          </FormRow>
          <FormError error={error} />
          <FormFooter>
            <Button
              disabled={status === 'loading'}
              loadingText="Updating..."
              onClick={submitForm}
              status={status}
              title="Update existing vital sign record"
              type="submit">
              Update Vital Sign Record
            </Button>
          </FormFooter>
        </Form>
      </FadeAnimation>
    </PageContent>
  )
}

export default VitalSignUpdate
