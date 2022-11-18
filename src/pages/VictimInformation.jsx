import { Add20, Catalog20, Close20, Download20, Edit20, Reset20, TrashCan20 } from '@carbon/icons-react'
import { navigate, useParams } from '@reach/router'

import ButtonIcon from '../components/ButtonIcon'
import { CSVLink } from 'react-csv'
import FadeAnimation from '../components/FadeAnimation'
import Field from '../components/Field'
import PageContent from '../components/PageContent'
import PaperView from '../components/PaperView'
import React from 'react'
import SectionBody from '../components/SectionBody'
import SectionHeader from '../components/SectionHeader'
import Toggle from '../components/Toggle'

function VictimInformation() {
  const [status, setStatus] = React.useState('success')

  return (
    <PageContent>
      <FadeAnimation>
        <PaperView>
          <SectionHeader bigTitle="Victim Information">
            {/* <CSVLink
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
            </CSVLink> */}
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
            <ButtonIcon color="red" onClick={() => navigate('/incidents/records/1', { replace: true })} status={status} title="Close">
              <Close20 />
            </ButtonIcon>
          </SectionHeader>
          <SectionBody>
            <Field label="Status" status={status} text="GREEN" />
          </SectionBody>
          <SectionHeader title="1. Personal Information" />
          <SectionBody>
            <Field label="Name of Victim" status={status} text="BERNABE SALAM" />
            <Field label="Gender" status={status} text="FEMALE" />
          </SectionBody>
          <SectionBody>
            <Field label="Birthday" status={status} text="January 17, 1992" />
            <Field label="Age" status={status} text="30" />
            <Field label="Civil Status" status={status} text="SINGLE" />
          </SectionBody>
          <SectionBody>
            <Field label="Municipality" status={status} text="CABARROGUIS" />
            <Field label="Barangay" status={status} text="ZAMORA" />
            <Field label="Purok / Street" status={status} text="02" />
          </SectionBody>
          <SectionBody>
            <Field label="Contact Person" status={status} text="REBECCA GODTAN" />
            <Field label="Contact Number" status={status} text="092X8X68X94" />
          </SectionBody>
          <SectionHeader title="2. Glasgow Coma Scale" />
          <SectionBody>
            <Field label="Best Eye Response" status={status} text="To verbal command" />
            <Field label="Best Verbal Response" status={status} text="Confused" />
            <Field label="Best Motor Response" status={status} text="Flexion to pain" />
            <Field label="Total GCS Score" status={status} text="10" />
          </SectionBody>
          <SectionHeader title="3. Bleeding" />
          <SectionBody>
            <Field label="With Bleeding">
              <Toggle available={true} />
            </Field>
            <Field label="Location" status={status} text="LEFT HYPOCHONDRIAC REGION" />
          </SectionBody>
          <SectionBody>
            <Field label="Mild">
              <Toggle available={false} />
            </Field>
            <Field label="Profuse / Severe">
              <Toggle available={true} />
            </Field>
          </SectionBody>
          <SectionHeader title="4. Pain Scale" />
          <SectionBody>
            <Field label="Onset of Pain" text="Recurrent" />
            <Field label="Location" status={status} text="LEFT HYPOCHONDRIAC REGION" />
          </SectionBody>
          <SectionHeader title="5. Secondary Assessment" />
          <SectionBody title="History of Illness">
            <SectionBody>
              <Field label="Heart Disease" status={status}>
                <Toggle available={false} />
              </Field>
              <Field label="Hypertension" status={status}>
                <Toggle available={false} />
              </Field>
              <Field label="Stroke" status={status}>
                <Toggle available={false} />
              </Field>
              <Field label="Diabetes" status={status}>
                <Toggle available={false} />
              </Field>
              <Field label="Asthma" status={status}>
                <Toggle available={false} />
              </Field>
              <Field label="Tubercolosis" status={status}>
                <Toggle available={false} />
              </Field>
              <Field label="Seizure" status={status}>
                <Toggle available={false} />
              </Field>
              <Field label="Covid-19" status={status}>
                <Toggle available={true} />
              </Field>
              <Field label="Others" status={status} text="NOT FOUND" />
            </SectionBody>
          </SectionBody>
          <SectionBody title="History of Last Hospitalization">
            <SectionBody>
              <Field label="Date of Last Confinement" status={status} text="May 05, 2014" />
              <Field label="Name of Hospital/Institution" status={status} text="RHODES ISLAND" />
              <Field label="Reason for Hospitalization" status={status} text="COVID-19 POSITIVE" />
            </SectionBody>
          </SectionBody>
          <SectionBody title="Intake/s">
            <SectionBody>
              <Field label="Last Oral Intake" status={status} text="May 05, 2014 04:28 PM" />
              <Field label="Last Alcohol Intake" status={status} text="May 05, 2014 04:28 PM" />
            </SectionBody>
          </SectionBody>
          <SectionBody title="Event(s) / Activities leading to the Incident or Injury">
            <SectionBody status={status}>SLIPPERY ROAD DUE TO HEAVY RAIN</SectionBody>
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
