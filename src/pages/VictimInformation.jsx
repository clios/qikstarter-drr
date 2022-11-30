import { Add20, ArrowLeft20, Catalog20, Download20, Edit16, Edit20, Reset20, TrashCan16, TrashCan20 } from '@carbon/icons-react'
import { navigate, useParams } from '@reach/router'

import AccountContext from '../contexts/AccountContext'
import Button from '../components/Button'
import ButtonIcon from '../components/ButtonIcon'
import { CSVLink } from 'react-csv'
import FadeAnimation from '../components/FadeAnimation'
import Field from '../components/Field'
import Help from '../Help'
import PageContent from '../components/PageContent'
import PaperView from '../components/PaperView'
import React from 'react'
import SectionBody from '../components/SectionBody'
import SectionHeader from '../components/SectionHeader'
import Table from '../components/Table'
import Toggle from '../components/Toggle'
import axios from 'axios'
import { confirmAlert } from 'react-confirm-alert'
import getVictimById from '../api/getVictimById'
import getVitalSigns from '../api/getVitalSigns'
import { toast } from 'react-toastify'

function VictimInformation() {
  // SEND GET USER REQUEST
  const ROUTE = useParams()
  const Victim = getVictimById(ROUTE.victim_id)
  const VitalSigns = getVitalSigns({ victim_id: ROUTE.victim_id, orders: 'recorded_at:desc' })

  // INFORMATION STATE
  const Account = React.useContext(AccountContext)
  const [status, setStatus] = React.useState('loading')
  const [vitalSigns, setVitalSigns] = React.useState([])

  // INFORMATION STATE: INCIDENT
  const [victim, setVictim] = React.useState({
    id: null,
    incident_id: null,
    name: null,
    sex: null,
    age: null,
    birthday: null,
    civil_status: null,
    municipal: null,
    barangay: null,
    purok: null,
    contact_person: null,
    contact_number: null,
    intervention: null,
    status: null,
    best_eye_response: null,
    best_verbal_response: null,
    best_motor_response: null,
    total_gcs_score: null,
    bleeding_status: null,
    bleeding_status_location: null,
    pain_onset: null,
    pain_location: null,
    history_of_illness: null,
    history_of_illness_ex: null,
    last_hospitalization_from: null,
    last_hospitalization_reason: null,
    last_hospitalization_date: null,
    oral_intake: null,
    alcohol_intake: null,
    events_leading_to_incident: null,
    endorsement_person: null,
    endorsement_hospital: null,
    endorsement_date: null,
    created_at: null,
    updated_at: null
  })

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // ON FETCH VICTIMS
  React.useEffect(() => {
    if (Victim.loading) setStatus('loading')
    if (Victim.error) setStatus('error')

    if (Victim.data) {
      setStatus('success')
      setVictim(Victim.data)
    }

    return () => setStatus('loading')
  }, [Victim.loading, Victim.error, Victim.data])

  // ON FETCH VITAL SIGNS
  React.useEffect(() => {
    if (VitalSigns.loading) setStatus('loading')
    if (VitalSigns.error) setStatus('error')

    if (VitalSigns.data) {
      setStatus('success')
      setVitalSigns(VitalSigns.data)
    }

    return () => setStatus('loading')
  }, [VitalSigns.loading, VitalSigns.error, VitalSigns.data])

  // DELETE VICTIM
  function deleteVictim() {
    const URL = process.env.BASE_URL + '/victims/' + ROUTE.victim_id
    const CONFIG = { headers: { Authorization: `Bearer ${localStorage.getItem('q-drr-web-token')}` } }

    confirmAlert({
      title: 'Delete Victim Record',
      message: 'This victim record will be permanently lost and you will not be able to recover it.',
      buttons: [
        {
          label: 'Delete',
          onClick: () => {
            axios
              .delete(URL, CONFIG)
              .then((response) => {
                if (response.status === 204) {
                  setStatus('success')
                  toast.success('Victim record has been deleted')
                  navigate('/incidents/records/' + ROUTE.incident_id)
                }
              })
              .catch((error) => {
                setStatus('success')
                if (error.response) {
                  if (error.response?.status === 403) toast.error('User credential is forbidden')
                  else if (error.response?.status === 404) toast.error('Victim was not found')
                  else if (error.response?.status === 500) toast.error('Unexpected server error')
                } else if (error.request) console.error(error.request)
                else console.error('Error', error.message)
              })
          }
        },
        { label: 'Cancel' }
      ]
    })
  }

  // DELETE VITAL SIGN
  function deleteVitalSign(id) {
    const URL = process.env.BASE_URL + '/vitalSigns/' + id
    const CONFIG = { headers: { Authorization: `Bearer ${localStorage.getItem('q-drr-web-token')}` } }

    confirmAlert({
      title: 'Delete Vital Sign Record',
      message: 'This vital sign record will be permanently lost and you will not be able to recover it.',
      buttons: [
        {
          label: 'Delete',
          onClick: () => {
            setStatus('loading')
            axios
              .delete(URL, CONFIG)
              .then((response) => {
                if (response.status === 204) {
                  toast.success('Vital sign record has been deleted')
                  VitalSigns.mutate().then(() => setStatus('success'))
                }
              })
              .catch((error) => {
                setStatus('success')
                if (error.response) {
                  if (error.response?.status === 403) toast.error('User credential is forbidden')
                  else if (error.response?.status === 404) toast.error('Vital sign was not found')
                  else if (error.response?.status === 500) toast.error('Unexpected server error')
                } else if (error.request) console.error(error.request)
                else console.error('Error', error.message)
              })
          }
        },
        { label: 'Cancel' }
      ]
    })
  }

  return (
    <PageContent>
      <FadeAnimation>
        <PaperView>
          <SectionHeader bigTitle="Victim Information">
            <ButtonIcon
              onClick={() => navigate(`/incidents/records/${ROUTE.incident_id}/victims/${ROUTE.victim_id}/edit`)}
              status={status}
              title="Edit incident record">
              <Edit20 />
            </ButtonIcon>
            <ButtonIcon color="red" onClick={deleteVictim} status={status} title="Delete incident record">
              <TrashCan20 />
            </ButtonIcon>
            <ButtonIcon
              color="gray"
              label="Back to Incident Rescue Information"
              onClick={() => navigate(`/incidents/records/${ROUTE.incident_id}`, { replace: true })}
              status={status}
              title="Close">
              <ArrowLeft20 />
            </ButtonIcon>
          </SectionHeader>
          <SectionBody>
            <Field label="Status" status={status} text={Help.displayText(victim.status)} />
          </SectionBody>
          <SectionHeader title="1. Personal Information" />
          <SectionBody>
            <Field label="Name of Victim" status={status} text={Help.displayText(victim.name)} />
            <Field label="Gender" status={status} text={Help.displayText(victim.sex)} />
          </SectionBody>
          <SectionBody>
            <Field label="Birthday" status={status} text={Help.displayDate(victim.birthday)} />
            <Field label="Age" status={status} text={Help.displayNumberWithComma(victim.age)} />
            <Field label="Civil Status" status={status} text={Help.displayText(victim.civil_status)} />
          </SectionBody>
          <SectionBody>
            <Field label="Municipality" status={status} text={Help.displayText(victim.municipal)} />
            <Field label="Barangay" status={status} text={Help.displayText(victim.barangay)} />
            <Field label="Purok / Street" status={status} text={Help.displayText(victim.purok)} />
          </SectionBody>
          <SectionBody>
            <Field label="Contact Person" status={status} text={Help.displayText(victim.contact_person)} />
            <Field label="Contact Number" status={status} text={Help.displayText(victim.contact_number)} />
          </SectionBody>
          <SectionHeader title="2. Vital Signs Monitoring">
            <Button
              color="green"
              onClick={() => navigate(`/incidents/records/${ROUTE.incident_id}/victims/${ROUTE.victim_id}/vital_signs/add`, { replace: true })}
              status={status}>
              Add Vital Sign Record
            </Button>
          </SectionHeader>
          <div className="sub-section-table">
            <Table
              className="no-click"
              status={status}
              emptyLabel="No vital sign record/s  found"
              headers={['Recorded At', 'Airway', 'Respiratory Rate (CPM)', 'Pulse/Heart Rate (BPM)', 'Blood Pressure (mmHg)', 'Action'].filter(
                Boolean
              )}
              total={vitalSigns.records?.total}>
              {status === 'success' &&
                vitalSigns.records?.vital_signs.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{Help.displayDateTimeSimple(item.recorded_at)}</td>
                      <td>{item.airway?.toUpperCase()}</td>
                      <td>{Help.displayNumber(item.respiratory_rate)}</td>
                      <td>{Help.displayNumber(item.pulse_rate)}</td>
                      <td>
                        {item.systolic}/{item.diastolic}
                      </td>
                      <td>
                        <div className="sub-section-action">
                          <ButtonIcon
                            color="gray"
                            status={status}
                            onClick={() =>
                              navigate(`/incidents/records/${ROUTE.incident_id}/victims/${ROUTE.victim_id}/vital_signs/${item.id}/edit`)
                            }>
                            <Edit16 />
                          </ButtonIcon>
                          <ButtonIcon color="gray" status={status} onClick={() => deleteVitalSign(item.id)}>
                            <TrashCan16 />
                          </ButtonIcon>
                        </div>
                      </td>
                    </tr>
                  )
                })}
            </Table>
          </div>
          <SectionHeader title="3. Glasgow Coma Scale" />
          <SectionBody>
            <Field label="Best Eye Response" status={status} text={Help.displayText(victim.best_eye_response)} />
            <Field label="Best Verbal Response" status={status} text={Help.displayText(victim.best_verbal_response)} />
            <Field label="Best Motor Response" status={status} text={Help.displayText(victim.best_motor_response)} />
            <Field label="Total GCS Score" status={status} text={Help.displayNumber(victim.total_gcs_score)} />
          </SectionBody>
          <SectionHeader title="4. Bleeding" />
          <SectionBody>
            <Field label="Bleeding Status" status={status} text={Help.displayText(victim.bleeding_status)} />
            <Field label="Location" status={status} text={Help.displayText(victim.bleeding_status_location)} />
          </SectionBody>
          <SectionHeader title="5. Pain Scale" />
          <SectionBody>
            <Field label="Onset of Pain" text={Help.displayText(victim.pain_onset)} />
            <Field label="Location" status={status} text={Help.displayText(victim.pain_location)} />
          </SectionBody>
          <SectionHeader title="6. Secondary Assessment" />
          <div className="sub-section-header">6.1 History of Illness</div>
          <SectionBody>
            <Field label="Heart Disease" status={status}>
              <Toggle available={Help.findInArray(victim.history_of_illness, 'heart disease')} />
            </Field>
            <Field label="Hypertension" status={status}>
              <Toggle available={Help.findInArray(victim.history_of_illness, 'hypertension')} />
            </Field>
            <Field label="Stroke" status={status}>
              <Toggle available={Help.findInArray(victim.history_of_illness, 'stroke')} />
            </Field>
            <Field label="Diabetes" status={status}>
              <Toggle available={Help.findInArray(victim.history_of_illness, 'diabetes')} />
            </Field>
            <Field label="Asthma" status={status}>
              <Toggle available={Help.findInArray(victim.history_of_illness, 'asthma')} />
            </Field>
            <Field label="Tuberculosis" status={status}>
              <Toggle available={Help.findInArray(victim.history_of_illness, 'tuberculosis')} />
            </Field>
            <Field label="Seizure" status={status}>
              <Toggle available={Help.findInArray(victim.history_of_illness, 'seizure')} />
            </Field>
            <Field label="Covid-19" status={status}>
              <Toggle available={Help.findInArray(victim.history_of_illness, 'covid-19')} />
            </Field>
            <Field label="Others" status={status} text={Help.displayText(victim.history_of_illness_ex)} />
          </SectionBody>
          <div className="sub-section-header">6.2 History of Last Hospitalization</div>
          <SectionBody>
            <Field label="Date of Last Confinement" status={status} text={Help.displayDateTimeSimple(victim.last_hospitalization_date)} />
            <Field label="Name of Hospital/Institution" status={status} text={Help.displayText(victim.last_hospitalization_from)} />
            <Field label="Reason for Hospitalization" status={status} text={Help.displayText(victim.last_hospitalization_reason)} />
          </SectionBody>
          <div className="sub-section-header">6.3 Last Intake/s</div>
          <SectionBody>
            <Field label="Last Oral Intake" status={status} text={Help.displayDateTimeSimple(victim.oral_intake)} />
            <Field label="Last Alcohol Intake" status={status} text={Help.displayDateTimeSimple(victim.alcohol_intake)} />
          </SectionBody>
          <div className="sub-section-header">6.4 Event(s) / Activities leading to the Incident or Injury</div>
          <SectionBody status={status}>
            <Field label="Description" status={status} text={Help.displayText(victim.events_leading_to_incident)} />
          </SectionBody>
          <SectionHeader title="7. Interventions Given" />
          <SectionBody status={status}>
            <Field label="Description" status={status} text={Help.displayText(victim.intervention)} />
          </SectionBody>
          <SectionHeader title="8. Endorsement to Health Facility" />
          <SectionBody>
            <Field label="Name" status={status} text={Help.displayText(victim.endorsement_person)} />
            <Field label="Date & Time" status={status} text={Help.displayDateTimeSimple(victim.endorsement_date)} />
            <Field label="Name of Hospital/Institution" status={status} text={Help.displayText(victim.endorsement_hospital)} />
          </SectionBody>
        </PaperView>
      </FadeAnimation>
    </PageContent>
  )
}

export default VictimInformation
