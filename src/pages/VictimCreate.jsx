import Account from '../json/account.json'
import AccountContext from '../contexts/AccountContext'
import Address from '../Address'
import Authorization from '../components/Authorization'
import Button from '../components/Button'
import ButtonIcon from '../components/ButtonIcon'
import Checkbox from '../components/Checkbox'
import { Close20 } from '@carbon/icons-react'
import FadeAnimation from '../components/FadeAnimation'
import Field from '../components/Field'
import Form from '../components/Form'
import FormFooter from '../components/FormFooter'
import FormRow from '../components/FormRow'
import Input from '../components/Input'
import PageContent from '../components/PageContent'
import React from 'react'
import SectionHeader from '../components/SectionHeader'
import Select from '../components/Select'
import Textarea from '../components/Textarea'
import { navigate } from '@reach/router'
import { toast } from 'react-toastify'

function VictimCreate() {
  // INFORMATION STATE
  // const Account = React.useContext(AccountContext)
  const [status, setStatus] = React.useState('success')
  const [helper, setHelper] = React.useState({})
  const [password, setPassword] = React.useState('')

  // INPUT STATE
  const [name, setName] = React.useState('')
  const [birthday, setBirthday] = React.useState('')
  const [sex, setSex] = React.useState('')
  const [marital_status, setMaritalStatus] = React.useState('')
  const [barangay, setBarangay] = React.useState(Account.vicinity_barangay)
  const [municipality, setMunicipality] = React.useState(Account.vicinity_municipality)
  const [purok, setPurok] = React.useState('')
  const [street, setStreet] = React.useState('')
  const [house_number, setHouseNumber] = React.useState('')

  function submitForm(e) {
    e.preventDefault()
    // setStatus('loading')

    // const URL = process.env.BASE_URL + '/residents'
    // const DATA = {
    //   name: name?.toUpperCase(),
    //   barangay: barangay,
    //   municipality: municipality,
    //   province: province
    // }
    // const CONFIG = { headers: { Authorization: `Bearer ${localStorage.getItem('q-drr-web-token')}` } }

    // axios
    //   .post(URL, DATA, CONFIG)
    //   .then((response) => {
    //     if (response.status === 201) {
    //       setStatus('success')
    toast.success('New victim record has been created')
    navigate('/incidents/records/1', { replace: true })
    //   }
    // })
    // .catch((error) => {
    //   setStatus('success')
    //   if (error.response) {
    //     if (error.response?.status === 400) {
    //       setHelper(error.response.data)
    //       toast.error('Form input is invalid')
    //     } else if (error.response?.status === 403) toast.error('User credential is forbidden')
    //     else if (error.response?.status === 500) toast.error('Unexpected server error')
    //   } else if (error.request) console.error(error.request)
    //   else console.error('Error', error.message)
    // })
  }

  return (
    // <Authorization permissions={Account.permissions} permission="write_resident">
    <PageContent>
      <FadeAnimation>
        <Form status={status}>
          <SectionHeader bigTitle="Victim Profile">
            <ButtonIcon color="red" onClick={() => navigate('/incidents/records/1', { replace: true })} status={status} title="Close this form">
              <Close20 />
            </ButtonIcon>
          </SectionHeader>
          <FormRow>
            <Field error={helper.name} label="Status" status={status}>
              <Select>
                <option>GREEN</option>
                <option>YELLOW</option>
                <option>RED</option>
                <option>BLACK</option>
              </Select>
            </Field>
          </FormRow>
          <SectionHeader title="1. Personal Information" />
          <FormRow>
            <Field error={helper.name} label="Name of Victim" status={status}>
              <Input uppercase onChange={(e) => setName(e.target.value)} required size={30} type="text" value={name} />
            </Field>
            <Field error={helper.name} label="Birthdate" status={status}>
              <Input uppercase required type="date" />
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
            <Field error={helper.name} label="Contact Person" status={status}>
              <Input uppercase onChange={(e) => setName(e.target.value)} required size={30} type="text" value={name} />
            </Field>
            <Field error={helper.name} label="Contact Number" status={status}>
              <Input uppercase onChange={(e) => setName(e.target.value)} required size={30} type="text" value={name} />
            </Field>
          </FormRow>
          <SectionHeader title="2. Glasgow Coma Scale" />
          <FormRow status={status}>
            <Field label="Eye Response">
              <Checkbox text="(4) Spontaneous opening" />
            </Field>
            <Checkbox text="(3) To verbal command" />
            <Checkbox text="(2) To pain" />
            <Checkbox text="(1) No eye opening" />
          </FormRow>
          <FormRow status={status}>
            <Field label="Verbal Response">
              <Checkbox text="(5) Oriented" />
            </Field>
            <Checkbox text="(4) Confused" />
            <Checkbox text="(3) Inappropriate word" />
            <Checkbox text="(2) Incomprehensible sounds" />
            <Checkbox text="(1) No verbal response" />
          </FormRow>
          <FormRow status={status}>
            <Field label="Motor Response">
              <Checkbox text="(6) Obeys command" />
            </Field>
            <Checkbox text="(5) Localizes pain" />
            <Checkbox text="(4) Withdrawal from pain" />
            <Checkbox text="(3) Flexion to pain" />
            <Checkbox text="(2) Extension to pain" />
            <Checkbox text="(1) No motor response" />
          </FormRow>
          <SectionHeader title="3. Bleeding" />
          <FormRow>
            <Field label="Bleeding status">
              <Checkbox text="No bleeding" />
            </Field>
            <Checkbox text="With bleeding" />
          </FormRow>
          <FormRow>
            <Field label="With bleeding">
              <Checkbox text="Mild" />
            </Field>
            <Checkbox text="Profuse / Severe" />
          </FormRow>
          <FormRow>
            <Field label="Location">
              <Input uppercase onChange={(e) => setName(e.target.value)} required size={30} type="text" value={name} />
            </Field>
          </FormRow>
          <SectionHeader title="4. Pain Scale" />
          <FormRow>
            <Field label="Onset">
              <Checkbox text="Sudden" />
            </Field>
            <Checkbox text="Recurrent" />
            <Checkbox text="Continuous" />
          </FormRow>
          <FormRow>
            <Field label="Location">
              <Input uppercase onChange={(e) => setName(e.target.value)} required size={30} type="text" value={name} />
            </Field>
          </FormRow>
          <SectionHeader title="5. Secondary Assessment" />
          <FormRow>
            <Field label="History of Illness">
              <Checkbox text="Heart Disease" />
            </Field>
            <Checkbox text="Hypertension" />
            <Checkbox text="Stroke" />
            <Checkbox text="Stroke" />
            <Checkbox text="Diabetes" />
          </FormRow>
          <FormRow>
            <Checkbox text="Asthma" />
            <Checkbox text="Tuberculosis" />
            <Checkbox text="Seizure" />
            <Checkbox text="Covid-19" />
            <Checkbox text="Others" />
          </FormRow>
          <FormRow>
            <Field label="Others, specify">
              <Input uppercase onChange={(e) => setName(e.target.value)} required size={30} type="text" value={name} />
            </Field>
          </FormRow>
          <FormRow title="History of Last Hospitalization">
            <FormRow>
              <Field label="Date">
                <Input type="date" />
              </Field>
              <Field label="Name of Hospital/Institution">
                <Input type="text" />
              </Field>
              <Field label="Reason for Hospitalization">
                <Input type="text" />
              </Field>
            </FormRow>
          </FormRow>
          <FormRow title="Oral Intake">
            <FormRow>
              <Field error={helper.name} label="Date" status={status}>
                <Input uppercase required type="date" />
              </Field>
              <Field error={helper.name} label="Time" status={status}>
                <Input uppercase required type="time" />
              </Field>
            </FormRow>
          </FormRow>
          <FormRow title="Alcohol Intake">
            <FormRow>
              <Field error={helper.name} label="Date" status={status}>
                <Input uppercase required type="date" />
              </Field>
              <Field error={helper.name} label="Time" status={status}>
                <Input uppercase required type="time" />
              </Field>
            </FormRow>
          </FormRow>
          <FormRow>
            <Field label="Activities leading to the incident or injury">
              <Input type="text" size={50} />
            </Field>
          </FormRow>
          <SectionHeader title="6. Interventions Given" />
          <FormRow>
            <Field label="Description">
              <Textarea cols={51} />
            </Field>
          </FormRow>
          <SectionHeader title="7. Endorsement to Health Facility" />
          <FormRow>
            <Field label="Full Name">
              <Input type="text" />
            </Field>
            <Field error={helper.name} label="Date" status={status}>
              <Input uppercase required type="date" />
            </Field>
            <Field error={helper.name} label="Time" status={status}>
              <Input uppercase required type="time" />
            </Field>
            <Field label="Name of Hospitalization / Institution">
              <Input type="text" size={30} />
            </Field>
          </FormRow>
          <FormFooter>
            <Button
              disabled={status === 'loading'}
              loadingText="Creating..."
              onClick={submitForm}
              status={status}
              title="Create new victim record"
              type="submit">
              Create Victim Record
            </Button>
          </FormFooter>
        </Form>
      </FadeAnimation>
    </PageContent>
    // </Authorization>
  )
}

export default VictimCreate
