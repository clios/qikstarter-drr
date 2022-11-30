import { ArrowLeft20, Information24 } from '@carbon/icons-react'
import { navigate, useParams } from '@reach/router'

import AccountContext from '../contexts/AccountContext'
import Address from '../Address'
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
import VicinityChecker from '../components/VicinityChecker'
import axios from 'axios'
import getUserById from '../api/getUserById'
import { toast } from 'react-toastify'

function UserUpdate() {
  // SEND GET USER REQUEST
  const ROUTE = useParams()
  const User = getUserById(ROUTE.user_id)

  // INFORMATION STATE
  const Account = React.useContext(AccountContext)
  const [status, setStatus] = React.useState('success')
  const [helper, setHelper] = React.useState({})
  const [error, setError] = React.useState({})

  // INPUT STATE
  const [name, setName] = React.useState('')
  const [office, setOffice] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [role, setRole] = React.useState('editor')

  // ON FETCH USER
  React.useEffect(() => {
    if (User.loading) setStatus('loading')
    if (User.error) setStatus('error')

    if (User.data) {
      setStatus('success')
      setName(User.data.name)
      setEmail(User.data.email)
      setOffice(User.data.office)
      setRole(User.data.role)
    }

    return () => setStatus('loading')
  }, [User.loading, User.error, User.data])

  // SEND PATCH USER REQUEST
  function submitForm(e) {
    e.preventDefault()
    setStatus('loading')

    const URL = process.env.BASE_URL + '/users/' + ROUTE.user_id
    const DATA = {
      email: email,
      name: name?.toUpperCase(),
      office: office?.toUpperCase(),
      role: role
    }
    const CONFIG = { headers: { Authorization: `Bearer ${localStorage.getItem('q-drr-web-token')}` } }

    axios
      .patch(URL, DATA, CONFIG)
      .then((response) => {
        if (response.status === 201) {
          setStatus('success')
          toast.success('User account has been updated')
          navigate('/users/records/' + ROUTE.user_id, { replace: true })
        }
      })
      .catch((error) => {
        setStatus('success')
        if (error.response) {
          if (error.response?.status === 400) {
            setHelper(error.response.data)
            toast.error('Form input is invalid')
          } else if (error.response?.status === 403) toast.error('User credential is forbidden')
          else if (error.response?.status === 404) toast.error('User was not found')
          else if (error.response?.status === 500) toast.error('Unexpected server error')
        } else if (error.request) console.error(error.request)
        else console.error('Error', error.message)
      })
  }

  return (
    <PageContent>
      <FadeAnimation>
        <Form status={status}>
          <SectionHeader bigTitle="Update User Account">
            <ButtonIcon
              color="gray"
              label="Back to User Account Information"
              onClick={() => navigate(`/users/records/${ROUTE.user_id}`, { replace: true })}
              status={status}
              title="Close">
              <ArrowLeft20 />
            </ButtonIcon>
          </SectionHeader>
          <SectionHeader title="1. Personal" />
          <FormRow>
            <Field error={helper.name} label="Full Name" status={status}>
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
          <FormError error={error} />
          <FormFooter>
            <Button
              disabled={status === 'loading'}
              loadingText="Updating..."
              onClick={submitForm}
              status={status}
              title="Update existing user account"
              type="submit">
              Update User Account
            </Button>
          </FormFooter>
        </Form>
      </FadeAnimation>
    </PageContent>
  )
}

export default UserUpdate
