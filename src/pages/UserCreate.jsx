import { ArrowLeft20, Information24 } from '@carbon/icons-react'

import Account from '../json/account.json'
import AccountContext from '../contexts/AccountContext'
import Address from '../Address'
import Authorization from '../components/Authorization'
import Button from '../components/Button'
import ButtonIcon from '../components/ButtonIcon'
import Checkbox from '../components/Checkbox'
import { Entropy } from 'entropy-string'
import FadeAnimation from '../components/FadeAnimation'
import Field from '../components/Field'
import Form from '../components/Form'
import FormError from '../components/FormError'
import FormFooter from '../components/FormFooter'
import FormRow from '../components/FormRow'
import Input from '../components/Input'
import PageContent from '../components/PageContent'
import React from 'react'
import SectionHeader from '../components/SectionHeader'
import Select from '../components/Select'
import axios from 'axios'
import { confirmAlert } from 'react-confirm-alert'
import { navigate } from '@reach/router'
import { toJpeg } from 'html-to-image'
import { toast } from 'react-toastify'

function UserCreate() {
  // INFORMATION STATE
  const Account = React.useContext(AccountContext)
  const [status, setStatus] = React.useState('success')
  const [helper, setHelper] = React.useState({})
  const [error, setError] = React.useState({})
  const [password, setPassword] = React.useState('')

  // INPUT STATE
  const [name, setName] = React.useState('')
  const [office, setOffice] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [role, setRole] = React.useState('editor')

  React.useState(() => {
    let entropy = new Entropy({ total: 1e6, risk: 1e9 }).string()
    setPassword(entropy.substring(0, 8))
    return () => setPassword('')
  }, [])

  function submitForm(e) {
    e.preventDefault()
    setStatus('loading')

    function successAlert() {
      confirmAlert({
        title: 'New User Account Created',
        message: 'User Access Ticket has been downloaded.',
        buttons: [{ label: 'Return to records', onClick: () => navigate('/users/records', { replace: true }) }],
        onClickOutside: () => navigate('/users/records', { replace: true })
      })
    }

    function downloadUAT(data) {
      toJpeg(document.getElementById('UserAccessTicket'))
        .then((dataUrl) => {
          var link = document.createElement('a')
          link.download = `${data.name}.jpeg`
          link.href = dataUrl
          link.click()
        })
        .then(() => {
          successAlert()
        })
        .catch(() => {
          toast.error('Download failed')
        })
    }

    const URL = process.env.BASE_URL + '/users'
    const DATA = {
      email: email,
      name: name?.toUpperCase(),
      office: office?.toUpperCase(),
      role: role,
      password: password
    }
    const CONFIG = { headers: { Authorization: `Bearer ${localStorage.getItem('q-drr-web-token')}` } }

    axios
      .post(URL, DATA, CONFIG)
      .then((response) => {
        if (response.status === 201) {
          setStatus('success')
          toast.success('New user account has been created')
          downloadUAT(response.data)
        }
      })
      .catch((error) => {
        setStatus('success')
        if (error.response) {
          if (error.response?.status === 400) {
            setHelper(error.response.data)
            setError(error.response.data)
            toast.error('Form input is invalid')
          } else if (error.response?.status === 403) toast.error('User credential is forbidden')
          else if (error.response?.status === 500) toast.error('Unexpected server error')
        } else if (error.request) console.error(error.request)
        else console.error('Error', error.message)
      })
  }

  return (
    <PageContent>
      <FadeAnimation>
        <Form status={status}>
          <SectionHeader bigTitle="Create User Account">
            <ButtonIcon
              color="gray"
              label="Back to User Accounts"
              onClick={() => navigate('/users/records', { replace: true })}
              status={status}
              title="Close">
              <ArrowLeft20 />
            </ButtonIcon>
          </SectionHeader>
          <SectionHeader title="1. Personal" />
          <FormRow>
            <Field error={helper.name} label="Full Name (first, middle, last)" status={status}>
              <Input uppercase onChange={(e) => setName(e.target.value)} required size={30} type="text" value={name} />
            </Field>
            <Field error={helper.email} label="Email" status={status}>
              <Input onChange={(e) => setEmail(e.target.value)} required size={30} type="email" value={email} />
            </Field>
          </FormRow>
          <SectionHeader title="2. Office" />
          <FormRow>
            <Field label="Office" status={status}>
              <Input uppercase onChange={(e) => setOffice(e.target.value)} required size={30} type="text" value={office} />
            </Field>
            <Field label="Role" status={status}>
              <Select onChange={(e) => setRole(e.target.value)} value={role}>
                <option value="admin">ADMIN</option>
                <option value="editor">EDITOR</option>
                <option value="subscriber">SUBSCRIBER</option>
              </Select>
            </Field>
          </FormRow>
          <SectionHeader title="3. User Access Ticket" />
          <FormRow>
            <div id="UserAccessTicket" className="uat">
              <p className="uat-title">User Access Ticket</p>
              <p className="uat-subtitle">Q-DRR MIS</p>
              <p className="uat-item">Name: {name?.toUpperCase() || 'N/A'}</p>
              <p className="uat-item">Email: {email || 'N/A'}</p>
              <p className="uat-item">Password: {password}</p>
              <p className="uat-item">Office: {office?.toUpperCase() || 'N/A'}</p>
              <p className="uat-item">Position: {role?.toUpperCase() || 'N/A'}</p>
              <p className="uat-note">
                Upon receipt of this ticket, use it immediately and change your password. Please refrain from sharing your password, thanks.
              </p>
            </div>
          </FormRow>
          <FormError error={error} />
          <FormFooter>
            <Button
              color="green"
              disabled={status === 'loading'}
              loadingText="Creating..."
              onClick={submitForm}
              status={status}
              title="Create new user"
              type="submit">
              Create User Account
            </Button>
          </FormFooter>
        </Form>
      </FadeAnimation>
    </PageContent>
  )
}

export default UserCreate
