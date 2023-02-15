import { Add20, ArrowLeft20, Catalog20, Edit20, Reset20, TrashCan20 } from '@carbon/icons-react'
import { DPI, Format, MapboxExportControl, PageOrientation, Size } from '@watergis/mapbox-gl-export'
import { navigate, useParams } from '@reach/router'

import AccountContext from '../contexts/AccountContext'
import Button from '../components/Button'
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
import Table from '../components/Table'
import Toggle from '../components/Toggle'
import axios from 'axios'
import { confirmAlert } from 'react-confirm-alert'
import getIncidentById from '../api/getIncidentById'
import getVictims from '../api/getVictims'
import mapMarker from '../mapMarker'
import mapboxgl from 'mapbox-gl'
import { toast } from 'react-toastify'

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN
mapboxgl.prewarm()

function IncidentInformation() {
  // SEND GET USER REQUEST
  const ROUTE = useParams()
  const Incident = getIncidentById(ROUTE.incident_id)
  const Victims = getVictims({ incident_id: ROUTE.incident_id, orders: 'name:asc' })

  // INFORMATION STATE
  const Account = React.useContext(AccountContext)
  const [status, setStatus] = React.useState('loading')
  const [map, setMap] = React.useState(null)
  const [totalVictims, setTotalVictims] = React.useState(0)

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

  // ON RENDER, REVALIDATE INCIDENT AND CREATE MAP
  React.useEffect(() => {
    setMap(
      new mapboxgl.Map({
        center: [121.647584, 16.323105],
        container: 'incident-map',
        cooperativeGestures: true,
        style: 'mapbox://styles/mapbox/satellite-streets-v11',
        zoom: 8
      })
    )
    window.scrollTo(0, 0)
  }, [])

  // AFTER CREATING MAP, ADD CONTROLS
  React.useEffect(() => {
    if (map) {
      map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }))
      map.addControl(new mapboxgl.FullscreenControl())
      map.addControl(
        new MapboxExportControl({
          PageSize: Size.A4,
          PageOrientation: PageOrientation.Portrait,
          Format: Format.PNG,
          DPI: DPI[96],
          Crosshair: true,
          PrintableArea: true,
          accessToken: process.env.MAPBOX_ACCESS_TOKEN
        })
      )
    }
  }, [map])

  // ON LOAD FARMER DATA
  React.useEffect(() => {
    if (map && Incident.data) {
      let lat = Incident.data.latitude
      let lng = Incident.data.longitude
      map.resize()

      // HAS COORDINATES
      if (lat && lng) {
        map.jumpTo({ center: [lng, lat], zoom: 17 })

        // ON LOAD OF STYLE DATA
        map.on('load', () => {
          // INCIDENT COORDINATES
          if (!map.getSource('incident-coordinates-src')) {
            map.addSource('incident-coordinates-src', {
              'type': 'geojson',
              'data': { 'type': 'Feature', 'geometry': { 'type': 'Point', 'coordinates': [lng, lat] } }
            })
            map.addImage('incident-mark', mapMarker(100, '#DF2020', map), { pixelRatio: 2 })
            map.addLayer({
              'id': 'incident-layer',
              'type': 'symbol',
              'source': 'incident-coordinates-src',
              'layout': { 'icon-image': 'incident-mark' }
            })
          } else {
            map.getSource('incident-coordinates-src').setData({ 'type': 'Feature', 'geometry': { 'type': 'Point', 'coordinates': [lng, lat] } })
          }
        })
      } else {
        map.on('load', () => {
          if (map.getSource('incident-coordinates-src')) {
            map.jumpTo({ center: [121.647584, 16.323105], zoom: 8 })
            map.getLayer('incident-layer') && map.setLayoutProperty('incident-layer', 'visibility', 'none')
          }
        })
      }
    }
  }, [map, Incident.data])

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

  // ON FETCH VICTIMS
  React.useEffect(() => {
    if (Victims.loading) setStatus('loading')
    if (Victims.error) setStatus('error')

    if (Victims.data) {
      setStatus('success')
      setTotalVictims(Victims.data.records.total)
    }

    return () => setStatus('loading')
  }, [Victims.loading, Victims.error, Victims.data])

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
            <ButtonIcon color="red" onClick={deleteIncident} status={status} title="Delete incident record">
              <TrashCan20 />
            </ButtonIcon>
            <ButtonIcon
              color="gray"
              label="Back to Incident Records"
              onClick={() => navigate('/incidents/records', { replace: true })}
              status={status}
              title="Close">
              <ArrowLeft20 />
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
            <div id="incident-map" className="map-container-incident" />
          </SectionBody>
          <div className="sub-section-header">2.5 Time of Incident</div>
          <SectionBody>
            <Field status={status} text={Help.displayDateTimeSimple(incident.occured_at)} />
          </SectionBody>
          <SectionHeader title="3. Victim Records">
            <Button color="green" onClick={() => navigate(`/incidents/records/${ROUTE.incident_id}/victims/add`, { replace: true })} status={status}>
              Add Victim Record
            </Button>
          </SectionHeader>
          <div className="sub-section-table">
            <Table
              status={status}
              emptyLabel="No victim/s found"
              headers={['Victim ID', 'Name', 'Age', 'Gender', 'Status', 'GCS Score'].filter(Boolean)}
              total={totalVictims}>
              {status === 'success' &&
                Victims.data?.records.victims.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      onClick={() => navigate(`/incidents/records/${item.incident_id}/victims/${item.id}`)}
                      title="Click to view more details">
                      <td>{item.id}</td>
                      <td>{item.name?.toUpperCase()}</td>
                      <td>{Help.displayNumberWithComma(item.age)}</td>
                      <td>{Help.displayText(item.sex)}</td>
                      <td>
                        {item.status === 'green' && <div className="box-green" />}
                        {item.status === 'yellow' && <div className="box-yellow" />}
                        {item.status === 'red' && <div className="box-red" />}
                        {item.status === 'black' && '⬛'}
                      </td>
                      <td>{Help.displayNumber(item.total_gcs_score)}</td>
                    </tr>
                  )
                })}
            </Table>
          </div>
          <SectionFooter status={status}>
            Last updated by {Help.displayText(incident.last_updated_by)} was {Help.displayDateTime(incident.created_at)}
          </SectionFooter>
        </PaperView>
      </FadeAnimation>
    </PageContent>
  )
}

export default IncidentInformation
