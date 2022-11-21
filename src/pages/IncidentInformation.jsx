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
import getIncidentById from '../api/getIncidentById'
import { toJpeg } from 'html-to-image'
import { toast } from 'react-toastify'

function IncidentInformation() {
  // SEND GET USER REQUEST
  const ROUTE = useParams()
  const Incident = getIncidentById(ROUTE.incident_id)

  // INFORMATION STATE
  const Account = React.useContext(AccountContext)
  const [status, setStatus] = React.useState('loading')
  // INFORMATION STATE: INCIDENT
  const [incident, setIncident] = React.useState({
    name: null,
    types: [],
    types_ex: null,
    municipal: null,
    barangay: null,
    purok: null,
    latitude: null,
    longitude: null,
    caller_name: null,
    caller_number: null,
    response_team: null,
    response_vehicle: null,
    involved_vehicle_motorcycle: null,
    involved_vehicle_hatchback: null,
    involved_vehicle_sedan: null,
    involved_vehicle_suv: null,
    involved_vehicle_van: null,
    involved_vehicle_pickup: null,
    called_at: null,
    occured_at: null,
    created_at: null,
    updated_at: null
  })

  // ON FETCH INCIDENT
  React.useEffect(() => {
    if (Incident.loading) setStatus('loading')
    if (Incident.error) setStatus('error')

    if (Incident.data) {
      setStatus('success')
      setIncident(Incident.data)
    }

    return () => setStatus('loading')
  }, [Incident.loading, Incident.error, Incident.data])

  // DELETE INCIDENT
  function deleteIncident() {
    const URL = process.env.BASE_URL + '/incidents/' + ROUTE.incident_id
    const CONFIG = { headers: { Authorization: `Bearer ${localStorage.getItem('q-drr-web-token')}` } }

    confirmAlert({
      title: 'Delete Incident Record',
      message: 'This incident record will be permanently lost and you will not be able to recover it.',
      buttons: [
        {
          label: 'Delete',
          onClick: () => {
            axios
              .delete(URL, CONFIG)
              .then((response) => {
                if (response.status === 204) {
                  setStatus('success')
                  toast.success('Incident record has been deleted')
                  navigate('/incidents/records')
                }
              })
              .catch((error) => {
                setStatus('success')
                if (error.response) {
                  if (error.response?.status === 403) toast.error('User credential is forbidden')
                  else if (error.response?.status === 404) toast.error('Incident was not found')
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
          <SectionHeader bigTitle="Incident Rescue Information">
            <ButtonIcon onClick={() => navigate('/incidents/records/' + ROUTE.incident_id + '/edit')} status={status} title="Edit incident record">
              <Edit20 />
            </ButtonIcon>
            <ButtonIcon onClick={deleteIncident} status={status} title="Delete incident record">
              <TrashCan20 />
            </ButtonIcon>
            <ButtonIcon color="red" onClick={() => navigate('/incidents/records', { replace: true })} status={status} title="Close">
              <Close20 />
            </ButtonIcon>
          </SectionHeader>
          <SectionHeader title="1. Incident Response" />
          <SectionBody>
            <Field label="Date and Time Called" status={status} text={Help.displayDateTimeSimple(incident.called_at)} />
          </SectionBody>
          <SectionBody>
            <Field label="Name of Caller" status={status} text={Help.displayText(incident.caller_name)} />
            <Field label="Caller Contact #" status={status} text={Help.displayText(incident.caller_number)} />
          </SectionBody>
          <SectionBody>
            <Field label="Team" status={status} text={Help.displayText(incident.response_team)} />
            <Field label="Vehicle" status={status} text={Help.displayText(incident.response_vehicle)} />
          </SectionBody>
          <SectionHeader title="2. Incident Information" />
          <div className="sub-section-header">2.1 Type/s of Incident</div>
          <SectionBody>
            <Field label="Trauma" status={status}>
              <Toggle available={Help.findInArray(incident.types, 'trauma')} />
            </Field>
            <Field label="Medical" status={status}>
              <Toggle available={Help.findInArray(incident.types, 'medical')} />
            </Field>
            <Field label="Obstetric" status={status}>
              <Toggle available={Help.findInArray(incident.types, 'obstetric')} />
            </Field>
            <Field label="Transfer" status={status}>
              <Toggle available={Help.findInArray(incident.types, 'transfer')} />
            </Field>
            <Field label="Vehicular" status={status}>
              <Toggle available={Help.findInArray(incident.types, 'vehicular')} />
            </Field>
            <Field label="Other" status={status}>
              <Toggle available={Help.findInArray(incident.types, 'other')} />
            </Field>
            {Help.findInArray(incident.types, 'other') && <Field label="Specified" text={Help.displayText(incident.types_ex)} />}
          </SectionBody>
          <div className="sub-section-header">2.2 Name of Incident</div>
          <SectionBody>
            <Field status={status} text={Help.displayText(incident.name)} />
          </SectionBody>
          <div className="sub-section-header">2.3 Vehicle/s Involved</div>
          {Help.findInArray(incident.types, 'vehicular') ? (
            <SectionBody>
              {incident.involved_vehicle_motorcycle > 0 && (
                <Field label="Motorcycle" status={status} text={Help.displayNumberWithComma(incident.involved_vehicle_motorcycle)} />
              )}
              {incident.involved_vehicle_hatchback > 0 && (
                <Field label="Hatchback" status={status} text={Help.displayNumberWithComma(incident.involved_vehicle_hatchback)} />
              )}
              {incident.involved_vehicle_sedan > 0 && (
                <Field label="Sedan" status={status} text={Help.displayNumberWithComma(incident.involved_vehicle_sedan)} />
              )}
              {incident.involved_vehicle_suv > 0 && (
                <Field label="Suv" status={status} text={Help.displayNumberWithComma(incident.involved_vehicle_suv)} />
              )}
              {incident.involved_vehicle_van > 0 && (
                <Field label="Van" status={status} text={Help.displayNumberWithComma(incident.involved_vehicle_van)} />
              )}
              {incident.involved_vehicle_pickup > 0 && (
                <Field label="Pickup" status={status} text={Help.displayNumberWithComma(incident.involved_vehicle_pickup)} />
              )}
            </SectionBody>
          ) : (
            <SectionBody>NOT FOUND</SectionBody>
          )}
          <div className="sub-section-header">2.4 Place of Incident</div>
          <SectionBody>
            <Field label="Municipality" status={status} text={Help.displayText(incident.municipal)} />
            <Field label="Barangay" status={status} text={Help.displayText(incident.barangay)} />
            <Field label="Purok / Street" status={status} text={Help.displayText(incident.purok)} />
          </SectionBody>
          <div className="sub-section-header">2.5 Coordinates of Incident</div>
          <SectionBody>
            <Field label="Latitude" status={status} text={Help.displayNumber(incident.latitude)} />
            <Field label="Longitude" status={status} text={Help.displayNumber(incident.longitude)} />
          </SectionBody>
          <SectionBody>
            <Field label="Location" status={status} text="[MAP HERE]" />
          </SectionBody>
          <div className="sub-section-header">2.5 Time of Incident</div>
          <SectionBody>
            <Field status={status} text={Help.displayDateTimeSimple(incident.occured_at)} />
          </SectionBody>
          <SectionFooter status={status}>Last updated by [NAME HERE] was {Help.displayDateTime(incident.created_at)}</SectionFooter>
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
  )
}

export default IncidentInformation
