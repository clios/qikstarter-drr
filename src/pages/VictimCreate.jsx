import { navigate, useParams } from '@reach/router'

import Account from '../json/account.json'
import AccountContext from '../contexts/AccountContext'
import Address from '../Address'
import { ArrowLeft20 } from '@carbon/icons-react'
import Authorization from '../components/Authorization'
import Button from '../components/Button'
import ButtonIcon from '../components/ButtonIcon'
import Checkbox from '../components/Checkbox'
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
import { toast } from 'react-toastify'

function VictimCreate() {
  // INFORMATION STATE
  const ROUTE = useParams()
  const Account = React.useContext(AccountContext)
  const [status, setStatus] = React.useState('success')
  const [helper, setHelper] = React.useState({})
  const [error, setError] = React.useState({})

  // INPUT STATE
  const [victim_status, setVictimStatus] = React.useState('')
  // 1. PERSONAL INFORMATION
  const [name, setName] = React.useState('')
  const [birthdate, setBirthdate] = React.useState('')
  const [sex, setSex] = React.useState('')
  const [marital_status, setMaritalStatus] = React.useState('')
  const [municipality, setMunicipality] = React.useState('')
  const [barangay, setBarangay] = React.useState('')
  const [purok, setPurok] = React.useState('')
  const [contact_person, setContactPerson] = React.useState('')
  const [contact_number, setContactNumber] = React.useState('')
  // 2. GLASGOW COMA SCALE
  const [best_eye_response, setBestEyeResponse] = React.useState('')
  const [best_verbal_response, setBestVerbalResponse] = React.useState('')
  const [best_motor_response, setBestMotorResponse] = React.useState('')
  // 3. BLEEDING
  const [bleeding_status, setBleedingStatus] = React.useState('')
  const [location_of_bleed, setLocationOfBleed] = React.useState('')
  // 4. PAIN SCALE
  const [onset_of_pain, setOnsetOfPain] = React.useState('')
  const [location_of_pain, setLocationOfPain] = React.useState('')
  // 5. SECONDARY ASSESSMENT
  const [history_of_illness_other, setHistoryOfIllnessOther] = React.useState(false)
  const [history_of_illness_heart_disease, setHistoryOfIllnessHeartDisease] = React.useState(false)
  const [history_of_illness_hypertension, setHistoryOfIllnessHypertension] = React.useState(false)
  const [history_of_illness_stroke, setHistoryOfIllnessStroke] = React.useState(false)
  const [history_of_illness_diabetes, setHistoryOfIllnessDiabetes] = React.useState(false)
  const [history_of_illness_asthma, setHistoryOfIllnessAsthma] = React.useState(false)
  const [history_of_illness_tuberculosis, setHistoryOfIllnessTuberculosis] = React.useState(false)
  const [history_of_illness_seizure, setHistoryOfIllnessSeizure] = React.useState(false)
  const [history_of_illness_covid_19, setHistoryOfIllnessCovid_19] = React.useState(false)
  const [history_of_illness_specify, setHistoryOfIllnessSpecify] = React.useState('')
  const [last_hospitalization_date, setLastHospitalizationDate] = React.useState('')
  const [last_hospitalization_name, setLastHospitalizationName] = React.useState('')
  const [last_hospitalization_reason, setLastHospitalizationReason] = React.useState('')
  const [oral_intake_date, setOralIntakeDate] = React.useState('')
  const [oral_intake_time, setOralIntakeTime] = React.useState('')
  const [alcohol_intake_date, setAlcoholIntakeDate] = React.useState('')
  const [alcohol_intake_time, setAlcoholIntakeTime] = React.useState('')
  const [activities_leading_to_incident, setActivitiesLeadingToIncident] = React.useState('')
  // 6. INTERVENTIONS GIVEN
  const [interventions_given, setInterventionsGiven] = React.useState('')
  // 7. ENDORSEMENT TO HEALTH FACILITY
  const [endorsement_full_name, setEndorsementFullName] = React.useState('')
  const [endorsement_date, setEndorsementDate] = React.useState('')
  const [endorsement_time, setEndorsementTime] = React.useState('')
  const [endorsement_hospital, setEndorsementHospital] = React.useState('')

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  function submitForm(e) {
    e.preventDefault()
    setStatus('loading')

    const URL = process.env.BASE_URL + '/victims'
    const DATA = {
      incident_id: Help.formInputNumber(ROUTE.incident_id),
      name: Help.formInputText(name),
      sex: Help.formSelect(sex),
      birthday: Help.formInputDate(birthdate),
      civil_status: Help.formSelect(marital_status),
      municipal: Help.formInputText(municipality),
      barangay: Help.formInputText(barangay),
      purok: Help.formInputText(purok),
      contact_person: Help.formInputText(contact_person),
      contact_number: Help.formInputText(contact_number),
      intervention: Help.formInputText(interventions_given),
      status: Help.formInputText(victim_status),
      best_eye_response: Help.formInputText(best_eye_response),
      best_verbal_response: Help.formInputText(best_verbal_response),
      best_motor_response: Help.formInputText(best_motor_response),
      bleeding_status: Help.formInputText(bleeding_status),
      bleeding_status_location: Help.formInputText(location_of_bleed),
      pain_onset: Help.formInputText(onset_of_pain),
      pain_location: Help.formInputText(location_of_pain),
      history_of_illness: Help.formArray(
        [
          history_of_illness_other && 'other',
          history_of_illness_heart_disease && 'heart disease',
          history_of_illness_hypertension && 'hypertension',
          history_of_illness_stroke && 'stroke',
          history_of_illness_diabetes && 'diabetes',
          history_of_illness_asthma && 'asthma',
          history_of_illness_tuberculosis && 'tuberculosis',
          history_of_illness_seizure && 'seizure',
          history_of_illness_covid_19 && 'covid-19'
        ].filter(Boolean)
      ),
      history_of_illness_ex: Help.formInputText(history_of_illness_specify),
      last_hospitalization_from: Help.formInputText(last_hospitalization_name),
      last_hospitalization_reason: Help.formInputText(last_hospitalization_reason),
      last_hospitalization_date: Help.formInputDate(last_hospitalization_date),
      oral_intake: Help.formInputDateTime(oral_intake_date, oral_intake_time),
      alcohol_intake: Help.formInputDateTime(alcohol_intake_date, alcohol_intake_time),
      events_leading_to_incident: Help.formInputText(activities_leading_to_incident),
      endorsement_person: Help.formInputText(endorsement_full_name),
      endorsement_hospital: Help.formInputText(endorsement_hospital),
      endorsement_date: Help.formInputDateTime(endorsement_date, endorsement_time)
    }
    const CONFIG = { headers: { Authorization: `Bearer ${localStorage.getItem('q-drr-web-token')}` } }

    axios
      .post(URL, DATA, CONFIG)
      .then((response) => {
        if (response.status === 201) {
          setStatus('success')
          toast.success('New victim record has been created')
          navigate(`/incidents/records/${ROUTE.incident_id}`, { replace: true })
        }
      })
      .catch((error) => {
        setStatus('success')
        if (error.response) {
          if (error.response?.status === 400) {
            setHelper(error.response.data)
            setError(error.response.data)
          } else if (error.response?.status === 403) toast.error('User credential is forbidden')
          else if (error.response?.status === 500) toast.error('Unexpected server error')
        } else if (error.request) console.error(error.request)
        else console.error('Error', error.message)
      })
  }

  return (
    // <Authorization permissions={Account.permissions} permission="write_resident">
    <PageContent>
      <FadeAnimation>
        <Form status={status}>
          <SectionHeader bigTitle="Add Victim Record">
            <ButtonIcon
              color="gray"
              label="Back to Incident Rescue Information"
              onClick={() => navigate(`/incidents/records/${ROUTE.incident_id}`, { replace: true })}
              status={status}
              title="Close this form">
              <ArrowLeft20 />
            </ButtonIcon>
          </SectionHeader>
          <FormRow>
            <Field error={helper.status} label="Status" status={status}>
              <Select onChange={(e) => setVictimStatus(e.target.value)} value={victim_status}>
                <option></option>
                <option value="green">GREEN</option>
                <option value="yellow">YELLOW</option>
                <option value="red">RED</option>
                <option value="black">BLACK</option>
              </Select>
            </Field>
          </FormRow>
          <SectionHeader title="1. Personal Information" />
          <FormRow>
            <Field error={helper.name} label="Name of Victim" status={status}>
              <Input uppercase onChange={(e) => setName(e.target.value)} required size={30} type="text" value={name} />
            </Field>
            <Field error={helper.birthday} label="Birthdate" status={status}>
              <Input uppercase onChange={(e) => setBirthdate(e.target.value)} required type="date" value={birthdate} />
            </Field>
            <Field error={helper.sex} label="Gender" status={status}>
              <Select onChange={(e) => setSex(e.target.value)} value={sex}>
                <option value="">NO ANSWER</option>
                <option value="male">MALE</option>
                <option value="female">FEMALE</option>
              </Select>
            </Field>
            <Field error={helper.marital_status} label="Civil Status" status={status}>
              <Select onChange={(e) => setMaritalStatus(e.target.value)} value={marital_status}>
                <option value="">NO ANSWER</option>
                <option value="single">SINGLE</option>
                <option value="married">MARRIED</option>
                <option value="widowed">WIDOWED</option>
                <option value="separated">SEPARATED</option>
                <option value="divorced">DIVORCED</option>
              </Select>
            </Field>
          </FormRow>
          <FormRow>
            <Field label="Municipality" status={status}>
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
            <Field label="Barangay" status={status}>
              <Select onChange={(e) => setBarangay(e.target.value)} value={barangay}>
                <option value=""></option>
                {Address.Barangays('02', 'QUIRINO', municipality).map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </Field>
            <Field error={helper.purok} label="Purok / Street" status={status}>
              <Input uppercase onChange={(e) => setPurok(e.target.value)} type="text" value={purok} />
            </Field>
          </FormRow>
          <FormRow>
            <Field label="Contact Person" status={status}>
              <Input uppercase onChange={(e) => setContactPerson(e.target.value)} required size={30} type="text" value={contact_person} />
            </Field>
            <Field label="Contact Number" status={status}>
              <Input uppercase onChange={(e) => setContactNumber(e.target.value)} required size={30} type="text" value={contact_number} />
            </Field>
          </FormRow>
          <SectionHeader title="2. Glasgow Coma Scale" />
          <FormRow>
            <Field label="Best Eye Response">
              <Select onChange={(e) => setBestEyeResponse(e.target.value)} value={best_eye_response}>
                <option></option>
                <option value="no eye opening">(1) NO EYE OPENING</option>
                <option value="eye opening to pain">(2) TO PAIN</option>
                <option value="eye opening to sound">(3) TO VERBAL COMMAND</option>
                <option value="eyes open spontaneously">(4) SPONTANEOUS OPENING</option>
              </Select>
            </Field>
            <Field label="Best Verbal Response">
              <Select onChange={(e) => setBestVerbalResponse(e.target.value)} value={best_verbal_response}>
                <option></option>
                <option value="no verbal response">(1) NO VERBAL RESPONSE</option>
                <option value="incomprehensible sounds">(2) INCOMPREHENSIBLE SOUNDS</option>
                <option value="inappropriate words">(3) INAPPROPRIATE WORD</option>
                <option value="confused">(4) CONFUSED</option>
                <option value="orientated">(5) ORIENTED</option>
              </Select>
            </Field>
            <Field label="Best Motor Response">
              <Select onChange={(e) => setBestMotorResponse(e.target.value)} value={best_motor_response}>
                <option></option>
                <option value="no motor response">(1) NO MOTOR RESPONSE</option>
                <option value="abnormal extension to pain">(2) EXTENSION TO PAIN</option>
                <option value="abnormal flexion to pain">(3) FLEXION TO PAIN</option>
                <option value="withdrawal from pain">(4) WITHDRAWAL FROM PAIN</option>
                <option value="localizing pain">(5) LOCALIZES PAIN</option>
                <option value="obeys commands">(6) OBEYS COMMAND</option>
              </Select>
            </Field>
          </FormRow>
          <SectionHeader title="3. Bleeding" />
          <FormRow>
            <Field label="Bleeding status">
              <Select onChange={(e) => setBleedingStatus(e.target.value)} value={bleeding_status}>
                <option></option>
                <option value="no bleeding">NO BLEEDING</option>
                <option value="with mild bleeding">WITH MILD BLEEDING</option>
                <option value="with severe bleeding">WITH SEVERE BLEEDING</option>
              </Select>
            </Field>
            <Field label="Location">
              <Input uppercase onChange={(e) => setLocationOfBleed(e.target.value)} required size={30} type="text" value={location_of_bleed} />
            </Field>
          </FormRow>
          <SectionHeader title="4. Pain Scale" />
          <FormRow>
            <Field label="Onset of Pain">
              <Select onChange={(e) => setOnsetOfPain(e.target.value)} value={onset_of_pain}>
                <option></option>
                <option value="sudden">SUDDEN</option>
                <option value="recurrent">RECURRENT</option>
                <option value="continuous">CONTINUOUS</option>
              </Select>
            </Field>
            <Field label="Location of Pain">
              <Input uppercase onChange={(e) => setLocationOfPain(e.target.value)} required size={30} type="text" value={location_of_pain} />
            </Field>
          </FormRow>
          <SectionHeader title="5. Secondary Assessment" />
          <div className="sub-section-header">5.1 History of Illness</div>
          <FormRow>
            <Checkbox
              checked={history_of_illness_heart_disease}
              onChange={(e) => setHistoryOfIllnessHeartDisease(e.target.checked)}
              text="Heart Disease"
            />
            <Checkbox
              checked={history_of_illness_hypertension}
              onChange={(e) => setHistoryOfIllnessHypertension(e.target.checked)}
              text="Hypertension"
            />
            <Checkbox checked={history_of_illness_stroke} onChange={(e) => setHistoryOfIllnessStroke(e.target.checked)} text="Stroke" />
            <Checkbox checked={history_of_illness_diabetes} onChange={(e) => setHistoryOfIllnessDiabetes(e.target.checked)} text="Diabetes" />
            <Checkbox checked={history_of_illness_asthma} onChange={(e) => setHistoryOfIllnessAsthma(e.target.checked)} text="Asthma" />
            <Checkbox
              checked={history_of_illness_tuberculosis}
              onChange={(e) => setHistoryOfIllnessTuberculosis(e.target.checked)}
              text="Tuberculosis"
            />
            <Checkbox checked={history_of_illness_seizure} onChange={(e) => setHistoryOfIllnessSeizure(e.target.checked)} text="Seizure" />
            <Checkbox checked={history_of_illness_covid_19} onChange={(e) => setHistoryOfIllnessCovid_19(e.target.checked)} text="Covid-19" />
            <Checkbox checked={history_of_illness_other} onChange={(e) => setHistoryOfIllnessOther(e.target.checked)} text="Others" />
          </FormRow>
          <FormRow>
            <Field label="Others, specify">
              <Input
                uppercase
                onChange={(e) => setHistoryOfIllnessSpecify(e.target.value)}
                required
                size={30}
                type="text"
                value={history_of_illness_specify}
              />
            </Field>
          </FormRow>
          <div className="sub-section-header">5.2 History of Last Hospitalization</div>
          <FormRow>
            <Field label="Date">
              <Input onChange={(e) => setLastHospitalizationDate(e.target.value)} type="date" value={last_hospitalization_date} />
            </Field>
            <Field label="Name of Hospital/Institution">
              <Input onChange={(e) => setLastHospitalizationName(e.target.value)} uppercase type="text" value={last_hospitalization_name} />
            </Field>
            <Field label="Reason for Hospitalization">
              <Input onChange={(e) => setLastHospitalizationReason(e.target.value)} uppercase type="text" value={last_hospitalization_reason} />
            </Field>
          </FormRow>
          <div className="sub-section-header">5.3 Last Oral Intake</div>
          <FormRow>
            <Field label="Date" status={status}>
              <Input onChange={(e) => setOralIntakeDate(e.target.value)} uppercase required type="date" value={oral_intake_date} />
            </Field>
            <Field label="Time" status={status}>
              <Input onChange={(e) => setOralIntakeTime(e.target.value)} uppercase required type="time" value={oral_intake_time} />
            </Field>
          </FormRow>
          <div className="sub-section-header">5.4 Last Alcohol Intake</div>
          <FormRow>
            <Field label="Date" status={status}>
              <Input onChange={(e) => setAlcoholIntakeDate(e.target.value)} uppercase required type="date" value={alcohol_intake_date} />
            </Field>
            <Field label="Time" status={status}>
              <Input onChange={(e) => setAlcoholIntakeTime(e.target.value)} uppercase required type="time" value={alcohol_intake_time} />
            </Field>
          </FormRow>
          <div className="sub-section-header">5.5 Activities leading to the incident or injury</div>
          <FormRow>
            <Field label="Description">
              <Input
                onChange={(e) => setActivitiesLeadingToIncident(e.target.value)}
                uppercase
                type="text"
                size={50}
                value={activities_leading_to_incident}
              />
            </Field>
          </FormRow>
          <SectionHeader title="6. Interventions Given" />
          <FormRow>
            <Field error={helper.intervention} label="Description">
              <Textarea onChange={(e) => setInterventionsGiven(e.target.value)} uppercase cols={51} value={interventions_given} />
            </Field>
          </FormRow>
          <SectionHeader title="7. Endorsement to Health Facility" />
          <FormRow>
            <Field label="Full Name" status={status}>
              <Input onChange={(e) => setEndorsementFullName(e.target.value)} uppercase type="text" value={endorsement_full_name} />
            </Field>
            <Field label="Date" status={status}>
              <Input onChange={(e) => setEndorsementDate(e.target.value)} uppercase type="date" value={endorsement_date} />
            </Field>
            <Field label="Time" status={status}>
              <Input onChange={(e) => setEndorsementTime(e.target.value)} uppercase type="time" value={endorsement_time} />
            </Field>
            <Field label="Name of Hospital / Institution">
              <Input onChange={(e) => setEndorsementHospital(e.target.value)} uppercase type="text" size={30} value={endorsement_hospital} />
            </Field>
          </FormRow>
          <FormError error={error} />
          <FormFooter>
            <Button
              color="green"
              disabled={status === 'loading'}
              loadingText="Creating..."
              onClick={submitForm}
              status={status}
              title="Add new victim record"
              type="submit">
              Add Victim Record
            </Button>
          </FormFooter>
        </Form>
      </FadeAnimation>
    </PageContent>
    // </Authorization>
  )
}

export default VictimCreate
