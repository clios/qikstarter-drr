import { ArrowLeft20, Download20, Edit20, Information24, Password20, Power24, TrashCan20 } from '@carbon/icons-react'
import { navigate, useParams } from '@reach/router'

import AccountContext from '../contexts/AccountContext'
import Authorization from '../components/Authorization'
import ButtonIcon from '../components/ButtonIcon'
import { CSVLink } from 'react-csv'
import { Entropy } from 'entropy-string'
import FadeAnimation from '../components/FadeAnimation'
import Field from '../components/Field'
import Help from '../Help'
import PageContent from '../components/PageContent'
import PaperView from '../components/PaperView'
import React from 'react'
import SectionBody from '../components/SectionBody'
import SectionFooter from '../components/SectionFooter'
import SectionHeader from '../components/SectionHeader'
import Toggle from '../fragments/UserInformation/Toggle'
import axios from 'axios'
import { confirmAlert } from 'react-confirm-alert'
import getUserById from '../api/getUserById'
import { toJpeg } from 'html-to-image'
import { toast } from 'react-toastify'

function UserProfile() {
  // SEND GET USER REQUEST
  const ROUTE = useParams()
  const User = getUserById(ROUTE.user_id)

  // INFORMATION STATE
  const Account = React.useContext(AccountContext)
  const [status, setStatus] = React.useState('loading')
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [inactive, setIncative] = React.useState('')
  const [office, setOffice] = React.useState('')
  const [role, setRole] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [updated_at, setUpdatedAt] = React.useState('')

  // ON FETCH USER
  React.useEffect(() => {
    if (User.loading) setStatus('loading')
    if (User.error) setStatus('error')

    if (User.data) {
      setStatus('success')
      setName(User.data.name.toUpperCase())
      setEmail(User.data.email)
      setIncative(User.data.inactive ? 'YES' : 'NO')
      setOffice(User.data.office?.toUpperCase() || 'NOT FOUND')
      setRole(User.data.role?.toUpperCase() || 'NOT FOUND')
      setUpdatedAt(Help.displayDateTime(User.data.updated_at))
      let entropy = new Entropy({ total: 1e6, risk: 1e9 }).string()
      let pass = entropy.substring(0, 8)
      setPassword(pass)
    }

    return () => setStatus('loading')
  }, [User.loading, User.error, User.data])

  // DELETE USER
  function deleteUser() {
    const URL = process.env.BASE_URL + '/users/' + ROUTE.user_id
    const CONFIG = { headers: { Authorization: `Bearer ${localStorage.getItem('q-drr-web-token')}` } }

    confirmAlert({
      title: 'Delete User Account',
      message: 'This user account will be permanently lost and you will not be able to recover it.',
      buttons: [
        {
          label: 'Delete',
          onClick: () => {
            axios
              .delete(URL, CONFIG)
              .then((response) => {
                if (response.status === 204) {
                  setStatus('success')
                  toast.success('User account has been deleted')
                  navigate('/users/records')
                }
              })
              .catch((error) => {
                setStatus('success')
                if (error.response) {
                  if (error.response?.status === 403) toast.error('User credential is forbidden')
                  else if (error.response?.status === 404) toast.error('User was not found')
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

  // RESET PASSWORD
  function resetPassword() {
    function downloadUAT() {
      toJpeg(document.getElementById('UserAccessTicket'))
        .then((dataUrl) => {
          var link = document.createElement('a')
          link.download = `${name}.jpeg`
          link.href = dataUrl
          link.click()
        })
        .then(() => toast.success('User Access Ticket has been downloaded'))
        .catch(() => toast.error('Download failed'))
    }

    confirmAlert({
      title: 'Reset Password',
      message: 'Reset password and download new User Access Ticket',
      buttons: [
        {
          label: 'Reset',
          onClick: () => {
            setStatus('loading')
            const URL = process.env.BASE_URL + '/users/' + ROUTE.user_id
            const DATA = { password: password }
            const CONFIG = { headers: { Authorization: `Bearer ${localStorage.getItem('q-drr-web-token')}` } }

            axios
              .patch(URL, DATA, CONFIG)
              .then((response) => {
                if (response.status === 201) {
                  setStatus('success')
                  downloadUAT(response.data)
                }
              })
              .catch((error) => {
                setStatus('success')
                if (error.response) {
                  if (error.response?.status === 400) toast.error('Form input is invalid')
                  else if (error.response?.status === 403) toast.error('User credential is forbidden')
                  else if (error.response?.status === 404) toast.error('User was not found')
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

  // TOGGLE USER STATUS
  function toggleStatus() {
    setStatus('loading')
    const URL = process.env.BASE_URL + '/users/' + ROUTE.user_id + `${inactive === 'YES' ? '/activate' : '/deactivate'}`
    const DATA = null
    const CONFIG = { headers: { Authorization: `Bearer ${localStorage.getItem('q-drr-web-token')}` } }

    axios
      .post(URL, DATA, CONFIG)
      .then((response) => {
        if (response.status === 204) {
          User.mutate().then(() => {
            setStatus('success')
          })
        }
      })
      .catch((error) => {
        setStatus('success')
        if (error.response) {
          if (error.response?.status === 400) toast.error('Form input is invalid')
          else if (error.response?.status === 403) toast.error('User credential is forbidden')
          else if (error.response?.status === 404) toast.error('User was not found')
          else if (error.response?.status === 500) toast.error('Unexpected server error')
        } else if (error.request) console.error(error.request)
        else console.error('Error', error.message)
      })
  }

  return (
    <PageContent status={status}>
      <FadeAnimation>
        <PaperView>
          <SectionHeader bigTitle="User Account Information">
            <ButtonIcon onClick={() => navigate('/users/records/' + ROUTE.user_id + '/edit')} status={status} title="Edit user account">
              <Edit20 />
            </ButtonIcon>
            <ButtonIcon color="red" onClick={deleteUser} status={status} title="Delete user account">
              <TrashCan20 />
            </ButtonIcon>
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
          <SectionBody>
            <Field label="Name" status={status} text={name} />
            <Field label="Email" status={status} text={email} />
          </SectionBody>
          <SectionHeader title="2. Office" />
          <SectionBody>
            <Field label="Office" status={status} text={office} />
            <Field label="Role" status={status} text={role} />
          </SectionBody>
          <SectionHeader title="3. Permission"></SectionHeader>
          <SectionBody>
            <ButtonIcon onClick={toggleStatus} color={inactive === 'YES' ? 'red' : 'green'} status={status} title="">
              <Power24 />
            </ButtonIcon>
            <Field label="Status" status={status} text={inactive === 'YES' ? 'UNAUTHORIZED' : 'AUTHORIZED'} />
          </SectionBody>
          <SectionHeader title="4. Reset Security Password">
            <ButtonIcon onClick={resetPassword} status={status} title="Reset password">
              <Password20 />
            </ButtonIcon>
          </SectionHeader>
          <SectionBody status={status}>
            <div id="UserAccessTicket" className="uat">
              <p className="uat-title">User Access Ticket</p>
              <p className="uat-subtitle">Q-DRR MIS</p>
              <p className="uat-item">Name: {name}</p>
              <p className="uat-item">Email: {email}</p>
              <p className="uat-item">Password: {password}</p>
              <p className="uat-item">Office: {office}</p>
              <p className="uat-item">Role: {role}</p>
              <p className="uat-note">
                Upon receipt of this ticket, use it immediately and change your password. Please refrain from sharing your password, thanks.
              </p>
            </div>
          </SectionBody>
          <SectionFooter status={status}>Last Update {updated_at}</SectionFooter>
        </PaperView>
      </FadeAnimation>
    </PageContent>
  )
}

export default UserProfile
