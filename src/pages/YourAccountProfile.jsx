import { Edit20, Information24 } from '@carbon/icons-react'

import ButtonIcon from '../components/ButtonIcon'
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
import getAccount from '../api/getAccount'
import { navigate } from '@reach/router'

function YourAccountProfile() {
  // SEND GET ACCOUNT REQUEST
  const has_token = localStorage.getItem('q-drr-web-token') ? true : false
  const Account = getAccount(has_token)
  if (!has_token) return <Redirect to="/" noThrow replace />

  // INFORMATION STATE
  const [status, setStatus] = React.useState('success')
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [office, setOffice] = React.useState('')
  const [role, setRole] = React.useState('')
  const [updated_at, setUpdatedAt] = React.useState('')

  // ON FETCH USER
  React.useEffect(() => {
    if (Account.loading) setStatus('loading')
    if (Account.error) setStatus('error')

    if (Account.data) {
      setStatus('success')
      setName(Account.data.name.toUpperCase())
      setEmail(Account.data.email)
      setOffice(Account.data.office?.toUpperCase() || 'NOT FOUND')
      setRole(Account.data.role?.toUpperCase() || 'NOT FOUND')
      setUpdatedAt(Help.displayDateTime(Account.data.updated_at))
    }

    return () => setStatus('loading')
  }, [Account.loading, Account.error, Account.data])

  return (
    <PageContent>
      <FadeAnimation>
        <PaperView>
          <SectionHeader bigTitle="Your Account Information">
            <ButtonIcon onClick={() => navigate('/your-account/information/edit')} status={status} title="Edit your account">
              <Edit20 />
            </ButtonIcon>
          </SectionHeader>
          <SectionHeader title="1. Personal Information" />
          <SectionBody>
            <Field label="Name" status={status} text={name} />
            <Field label="Email" status={status} text={email} />
          </SectionBody>
          <SectionHeader title="2. Office Information" />
          <SectionBody>
            <Field label="Office" status={status} text={office} />
            <Field label="Role" status={status} text={role} />
          </SectionBody>
          <SectionFooter status={status}>Last Update {updated_at}</SectionFooter>
        </PaperView>
      </FadeAnimation>
    </PageContent>
  )
}

export default YourAccountProfile
