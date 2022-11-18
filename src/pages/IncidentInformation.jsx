import { Add20, Catalog20, Close20, Download20, Edit20, Reset20, TrashCan20 } from '@carbon/icons-react'
import { navigate, useParams } from '@reach/router'

import AccountContext from '../contexts/AccountContext'
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
import Toggle from '../components/Toggle'
import axios from 'axios'
import { confirmAlert } from 'react-confirm-alert'
import { toJpeg } from 'html-to-image'
import { toast } from 'react-toastify'

const Incident = {
  data: {
    'id': 1,
    'incident_at': '1995-12-08T00:00:00',
    'name': 'VEHICULAR ACCIDENT',
    'type': 'TRAUMA',
    'barangay': 'MAGSAYSAY',
    'municipality': 'SAGUDAY',
    'province': 'QUIRINO',
    'created_at': '2021-11-05T06:11:56.926268Z',
    'updated_at': '2021-11-05T06:11:56.926268Z'
  }
}

function IncidentInformation() {
  // SEND GET USER REQUEST
  const ROUTE = useParams()

  // INFORMATION STATE
  const Account = React.useContext(AccountContext)
  const [status, setStatus] = React.useState('loading')
  const [name, setName] = React.useState('')
  const [updated_at, setUpdatedAt] = React.useState('')

  // ON FETCH INCIDENT
  React.useEffect(() => {
    setStatus('success')
    return () => setStatus('loading')
  }, [])

  // DELETE INCIDENT
  function deleteIncident() {
    const URL = process.env.BASE_URL + '/incidents/' + ROUTE.user_id
    const CONFIG = { headers: { Authorization: `Bearer ${localStorage.getItem('q-drr-token')}` } }

    confirmAlert({
      title: 'Delete Incident Record',
      message: 'This incident record will be permanently lost and you will not be able to recover it.',
      buttons: [
        {
          label: 'Delete',
          onClick: () => {
            // axios
            //   .delete(URL, CONFIG)
            //   .then((response) => {
            //     if (response.status === 204) {
            //       setStatus('success')
            toast.success('Incident record has been deleted')
            navigate('/incidents/records')
            //   }
            // })
            // .catch((error) => {
            //   setStatus('success')
            //   if (error.response) {
            //     if (error.response?.status === 403) toast.error('User credential is forbidden')
            //     else if (error.response?.status === 404) toast.error('User was not found')
            //     else if (error.response?.status === 500) toast.error('Unexpected server error')
            //   } else if (error.request) console.error(error.request)
            //   else console.error('Error', error.message)
            // })
          }
        },
        { label: 'Cancel' }
      ]
    })
  }

  return (
    // <Authorization permissions={Account.permissions} permission="read_user">
    // {/* {status === 'success' && (
    //   <VicinityChecker
    //     accountVicinity={Help.displayTags([Account.vicinity_province, Account.vicinity_municipality, Account.vicinity_barangay])}
    //     recordAddress={Help.displayTags([User.data?.vicinity_province, User.data?.vicinity_municipality, User.data?.vicinity_barangay])}
    //   />
    // )} */}
    <PageContent>
      <FadeAnimation>
        <PaperView>
          <SectionHeader bigTitle="Incident Rescue Information">
            <CSVLink
              filename="INCIDENT.csv"
              data={[{ ...Incident.data }] || []}
              headers={[
                { label: 'Name', key: 'name' },
                { label: 'Email', key: 'email' },
                { label: 'Office', key: 'office' },
                { label: 'Position', key: 'position' },
                { label: 'Permissions', key: 'permissions' },
                { label: 'Deactivated', key: 'deactivated' },
                { label: 'Date Created', key: 'created_at' },
                { label: 'Date Updated', key: 'updated_at' }
              ]}>
              <ButtonIcon status={status} title="Download User Info">
                <Download20 />
              </ButtonIcon>
            </CSVLink>
            <ButtonIcon
              // onClick={() => navigate('/incidents/records/' + ROUTE.incident_id + '/edit')}
              // permission="write_user"
              // permissions={Account.permissions}
              status={status}
              title="Edit incident record">
              <Edit20 />
            </ButtonIcon>
            <ButtonIcon
              onClick={deleteIncident}
              // permission="write_user"
              // permissions={Account.permissions}
              status={status}
              title="Delete incident record">
              <TrashCan20 />
            </ButtonIcon>
            <ButtonIcon color="red" onClick={() => navigate('/incidents/records', { replace: true })} status={status} title="Close">
              <Close20 />
            </ButtonIcon>
          </SectionHeader>
          <SectionHeader title="1. Incident Response" />
          <SectionBody>
            <Field label="Date and Time" status={status} text="AUG 3, 2021 08:52 AM" />
          </SectionBody>
          <SectionBody>
            <Field label="Name of Caller" status={status} text="DONDIE ADUWAN" />
            <Field label="Caller Contact #" status={status} text={'09123456789'} />
          </SectionBody>
          <SectionBody>
            <Field label="Team" status={status} text="CHARLIE" />
            <Field label="Vehicle" status={status} text="AMBULANCE VICKY" />
          </SectionBody>
          <SectionHeader title="2. Incident Information" />
          <SectionBody title="Type/s of Incident">
            <SectionBody>
              <Field label="Trauma" status={status}>
                <Toggle available={true} />
              </Field>
              <Field label="Medical" status={status}>
                <Toggle available={false} />
              </Field>
              <Field label="Obstetric" status={status}>
                <Toggle available={true} />
              </Field>
              <Field label="Transfer" status={status}>
                <Toggle available={false} />
              </Field>
              <Field label="Vehicular" status={status}>
                <Toggle available={true} />
              </Field>
              <Field label="Others" status={status}>
                <Toggle available={false} />
              </Field>
            </SectionBody>
          </SectionBody>
          <SectionBody title="Name of Incident">
            <SectionBody>
              <Field status={status} text="TRANSPORT" />
            </SectionBody>
          </SectionBody>
          <SectionBody title="Vehicle/s Involved">
            <SectionBody>
              <Field label="SUV" status={status} text="1" />
              <Field label="Motorcycle" status={status} text="1" />
            </SectionBody>
          </SectionBody>
          <SectionBody title="Place of Incident">
            <SectionBody>
              <Field label="Municipality" status={status} text="CABARROGUIS" />
              <Field label="Barangay" status={status} text="EDEN" />
              <Field label="Purok / Street" status={status} text="PINOK" />
            </SectionBody>
          </SectionBody>
          <SectionBody title="Coordinates of Incident">
            <SectionBody>
              <Field label="Latitude" status={status} text="NOT FOUND" />
              <Field label="Longitude" status={status} text="NOT FOUND" />
            </SectionBody>
            <SectionBody>
              <Field label="Location" status={status} text="[MAP HERE]" />
            </SectionBody>
          </SectionBody>
          <SectionBody title="Date and Time">
            <SectionBody>
              <Field status={status} text="NOT FOUND" />
            </SectionBody>
          </SectionBody>
          <SectionFooter status={status}>Last updated by [NAME HERE] was [DATE AND TIME HERE]</SectionFooter>
        </PaperView>

        <PaperView>
          <SectionHeader bigTitle="Victim Records">
            <ButtonIcon
              // permission="write_user"
              // permissions={Account.permissions}
              status={status}
              title="Refresh victim records">
              <Reset20 />
            </ButtonIcon>
            <ButtonIcon
              label="Add Victim Record"
              onClick={() => navigate('/incidents/records/1/victims/add', { replace: true })}
              // permission="write_user"
              // permissions={Account.permissions}
              status={status}>
              <Add20 />
            </ButtonIcon>
          </SectionHeader>

          <PaperView>
            <SectionHeader title="Victim 1: BEN KAPPA">
              <ButtonIcon
                onClick={() => navigate('/incidents/records/1/victims/1')}
                // permission="write_user"
                // permissions={Account.permissions}
                status={status}
                title="View victim record">
                <Catalog20 />
              </ButtonIcon>
              <ButtonIcon
                // permission="write_user"
                // permissions={Account.permissions}
                status={status}
                title="Edit victim record">
                <Edit20 />
              </ButtonIcon>
              <ButtonIcon
                // permission="write_user"
                // permissions={Account.permissions}
                status={status}
                title="Delete victim record">
                <TrashCan20 />
              </ButtonIcon>
            </SectionHeader>
            <SectionBody>
              <Field label="Status" status={status} text="YELLOW" />
              <Field label="Gender" status={status} text="MALE" />
              <Field label="Age" status={status} text="27" />
            </SectionBody>

            <SectionHeader bigTitle="Vital Sign Monitoring">
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
            <SectionHeader title="May 21, 2022 04:47 PM">
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
            <SectionHeader title="May 21, 2022 05:18 PM">
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
          </PaperView>

          <PaperView>
            <SectionHeader title="Victim 2: TODMA DOPLI">
              <ButtonIcon
                onClick={() => navigate('/incidents/records/1/victims/1')}
                // permission="write_user"
                // permissions={Account.permissions}
                status={status}
                title="View victim record">
                <Catalog20 />
              </ButtonIcon>
              <ButtonIcon
                // permission="write_user"
                // permissions={Account.permissions}
                status={status}
                title="Edit victim record">
                <Edit20 />
              </ButtonIcon>
              <ButtonIcon
                // permission="write_user"
                // permissions={Account.permissions}
                status={status}
                title="Delete victim record">
                <TrashCan20 />
              </ButtonIcon>
            </SectionHeader>
            <SectionBody>
              <Field label="Status" status={status} text="YELLOW" />
              <Field label="Gender" status={status} text="MALE" />
              <Field label="Age" status={status} text="27" />
            </SectionBody>

            <SectionHeader bigTitle="Vital Sign Monitoring">
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
            <SectionHeader title="May 21, 2022 04:47 PM">
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
            <SectionHeader title="May 21, 2022 05:18 PM">
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
          </PaperView>
        </PaperView>
      </FadeAnimation>
    </PageContent>
    // </Authorization>
  )
}

export default IncidentInformation
