import { Add20, Catalog20, Close20, Download20, Edit20, Reset20, TrashCan20 } from '@carbon/icons-react'
import { navigate, useParams } from '@reach/router'

import AccountContext from '../contexts/AccountContext'
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
import Toggle from '../components/Toggle'
import getVictimById from '../api/getVictimById'

function VictimInformation() {
  // SEND GET USER REQUEST
  const ROUTE = useParams()
  const Victim = getVictimById(ROUTE.victim_id)

  // INFORMATION STATE
  const Account = React.useContext(AccountContext)
  const [status, setStatus] = React.useState('loading')

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

  return (
    <PageContent>
      <FadeAnimation>
        <PaperView>
          <SectionHeader bigTitle="Victim Information">
            <ButtonIcon
              // onClick={() => navigate('/incidents/records/' + ROUTE.incident_id + '/edit')}
              // permission="write_user"
              // permissions={Account.permissions}
              status={status}
              title="Edit incident record">
              <Edit20 />
            </ButtonIcon>
            <ButtonIcon
              // onClick={deleteIncident}
              // permission="write_user"
              // permissions={Account.permissions}
              status={status}
              title="Delete incident record">
              <TrashCan20 />
            </ButtonIcon>
            <ButtonIcon
              color="red"
              onClick={() => navigate(`/incidents/records/${ROUTE.incident_id}`, { replace: true })}
              status={status}
              title="Close">
              <Close20 />
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
          <SectionHeader title="2. Glasgow Coma Scale" />
          <SectionBody>
            <Field label="Best Eye Response" status={status} text={Help.displayText(victim.best_eye_response)} />
            <Field label="Best Verbal Response" status={status} text={Help.displayText(victim.best_verbal_response)} />
            <Field label="Best Motor Response" status={status} text={Help.displayText(victim.best_motor_response)} />
            <Field label="Total GCS Score" status={status} text={Help.displayNumber(victim.total_gcs_score)} />
          </SectionBody>
          <SectionHeader title="3. Bleeding" />
          <SectionBody>
            <Field label="Bleeding Status" status={status} text={Help.displayText(victim.bleeding_status)} />
            <Field label="Location" status={status} text={Help.displayText(victim.bleeding_status_location)} />
          </SectionBody>
          <SectionHeader title="4. Pain Scale" />
          <SectionBody>
            <Field label="Onset of Pain" text={Help.displayText(victim.pain_onset)} />
            <Field label="Location" status={status} text={Help.displayText(victim.pain_location)} />
          </SectionBody>
          <SectionHeader title="5. Secondary Assessment" />
          <SectionBody title="History of Illness">
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
              <Field label="Tubercolosis" status={status}>
                <Toggle available={Help.findInArray(victim.history_of_illness, 'tubercolosis')} />
              </Field>
              <Field label="Seizure" status={status}>
                <Toggle available={Help.findInArray(victim.history_of_illness, 'seizure')} />
              </Field>
              <Field label="Covid-19" status={status}>
                <Toggle available={Help.findInArray(victim.history_of_illness, 'covid-19')} />
              </Field>
              <Field label="Others" status={status} text={Help.displayText(victim.history_of_illness_ex)} />
            </SectionBody>
          </SectionBody>
          <SectionBody title="History of Last Hospitalization">
            <SectionBody>
              <Field label="Date of Last Confinement" status={status} text={Help.displayText(victim.last_hospitalization_date)} />
              <Field label="Name of Hospital/Institution" status={status} text={Help.displayText(victim.last_hospitalization_from)} />
              <Field label="Reason for Hospitalization" status={status} text={Help.displayText(victim.last_hospitalization_reason)} />
            </SectionBody>
          </SectionBody>
          <SectionBody title="Intake/s">
            <SectionBody>
              <Field label="Last Oral Intake" status={status} text={Help.displayDateTimeSimple(victim.oral_intake)} />
              <Field label="Last Alcohol Intake" status={status} text={Help.displayDateTimeSimple(victim.alcohol_intake)} />
            </SectionBody>
          </SectionBody>
          <SectionBody title="Event(s) / Activities leading to the Incident or Injury">
            <SectionBody status={status}>{Help.displayDateTimeSimple(victim.events_leading_to_incident)}</SectionBody>
          </SectionBody>
          <SectionHeader title="6. Interventions Given" />
          <SectionBody status={status}>{Help.displayText(victim.intervention)}</SectionBody>
          <SectionHeader title="7. Endorsement to Health Facility" />
          <SectionBody>
            <Field label="Name" status={status} text={Help.displayText(victim.endorsement_person)} />
            <Field label="Date & Time" status={status} text={Help.displayDateTimeSimple(victim.endorsement_date)} />
            <Field label="Name of Hospital/Institution" status={status} text={Help.displayText(victim.endorsement_hospital)} />
          </SectionBody>
        </PaperView>

        {/* <PaperView>
          <SectionHeader bigTitle="Vital Signs Monitoring">
            <ButtonIcon
              // permission="write_user"
              // permissions={Account.permissions}
              status={status}
              title="Refresh vital signs">
              <Reset20 />
            </ButtonIcon>
            <ButtonIcon
              label="Add Vital Sign"
              onClick={() => navigate('/incidents/records/1/victims/1/vital_signs/1', { replace: true })}
              // permission="write_user"
              // permissions={Account.permissions}
              status={status}>
              <Add20 />
            </ButtonIcon>
          </SectionHeader>
          <SectionHeader title="1. 05-21-2022 04:47 PM">
            <ButtonIcon
              // permission="write_user"
              // permissions={Account.permissions}
              status={status}
              title="Delete vital sign record">
              <TrashCan20 />
            </ButtonIcon>
          </SectionHeader>
          <SectionBody>
            <Field label="Airway" status={status} text="CLEAR" />
            <Field label="Respiratory Rate" status={status} text="80 cycles per minute" />
          </SectionBody>
          <SectionBody>
            <Field label="Pulse/Heart Rate" status={status} text="200 beats per minute" />
            <Field label="Blood Pressure" status={status} text="80/50 mmHg" />
          </SectionBody>
        </PaperView> */}
      </FadeAnimation>
    </PageContent>
  )
}

export default VictimInformation
