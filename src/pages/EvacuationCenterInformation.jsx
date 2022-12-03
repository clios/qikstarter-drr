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
import getEvacuationCenterById from '../api/getEvacuationCenterById'
import getIncidentById from '../api/getIncidentById'
import getVictims from '../api/getVictims'
import mapMarker from '../mapMarker'
import mapboxgl from 'mapbox-gl'
import { toast } from 'react-toastify'

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN
mapboxgl.prewarm()

function EvacuationCenterInformation() {
  // SEND GET EVACUATION CENTER REQUEST
  const ROUTE = useParams()
  const EvacuationCenter = getEvacuationCenterById(ROUTE.evacuation_center_id)

  // INFORMATION STATE
  const Account = React.useContext(AccountContext)
  const [status, setStatus] = React.useState('loading')
  const [map, setMap] = React.useState(null)
  const [totalVictims, setTotalVictims] = React.useState(0)

  // INFORMATION STATE: EVACUATION CENTER
  const [evacuationCenter, setEvacuationCenter] = React.useState({
    id: null,
    name: null,
    capacity: null,
    municipal: null,
    barangay: null,
    purok: null,
    latitude: null,
    longitude: null,
    facility_backup_power_source: null,
    facility_breastfeeding: null,
    facility_clinic: null,
    facility_communication_room: null,
    facility_council: null,
    facility_couples_room: null,
    facility_dining: null,
    facility_distilation_area: null,
    facility_electrical_room: null,
    facility_kitchen: null,
    facility_laundry_area: null,
    facility_pharmacy: null,
    facility_play_room: null,
    facility_registration_area: null,
    facility_rest_room: null,
    facility_water_station: null,
    is_government_owned: null,
    created_at: null,
    updated_at: null
  })

  // ON RENDER, CREATE MAP
  React.useEffect(() => {
    setMap(
      new mapboxgl.Map({
        center: [121.647584, 16.323105],
        container: 'evacuation-center-map',
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
    if (map && EvacuationCenter.data) {
      let lat = EvacuationCenter.data.latitude
      let lng = EvacuationCenter.data.longitude
      map.resize()

      // HAS COORDINATES
      if (lat && lng) {
        map.jumpTo({ center: [lng, lat], zoom: 17 })

        // ON LOAD OF STYLE DATA
        map.on('load', () => {
          // EVACUATION COORDINATES
          if (!map.getSource('evacuation-center-coordinates-src')) {
            map.addSource('evacuation-center-coordinates-src', {
              'type': 'geojson',
              'data': { 'type': 'Feature', 'geometry': { 'type': 'Point', 'coordinates': [lng, lat] } }
            })
            map.addImage('evacuation-center-mark', mapMarker(100, '#20A8DF', map), { pixelRatio: 2 })
            map.addLayer({
              'id': 'evacuation-center-layer',
              'type': 'symbol',
              'source': 'evacuation-center-coordinates-src',
              'layout': { 'icon-image': 'evacuation-center-mark' }
            })
          } else {
            map
              .getSource('evacuation-center-coordinates-src')
              .setData({ 'type': 'Feature', 'geometry': { 'type': 'Point', 'coordinates': [lng, lat] } })
          }
        })
      } else {
        map.on('load', () => {
          if (map.getSource('evacuation-center-coordinates-src')) {
            map.jumpTo({ center: [121.647584, 16.323105], zoom: 8 })
            map.getLayer('evacuation-center-layer') && map.setLayoutProperty('evacuation-center-layer', 'visibility', 'none')
          }
        })
      }
    }
  }, [map, EvacuationCenter.data])

  // ON FETCH EVACUATION CENTER
  React.useEffect(() => {
    if (EvacuationCenter.loading) setStatus('loading')
    if (EvacuationCenter.error) setStatus('error')

    if (EvacuationCenter.data) {
      setStatus('success')
      setEvacuationCenter(EvacuationCenter.data)
    }

    return () => setStatus('loading')
  }, [EvacuationCenter.loading, EvacuationCenter.error, EvacuationCenter.data])

  // DELETE EVACUATION CENTER
  function deleteEvacuationCenter() {
    const URL = process.env.BASE_URL + '/evacuationCenters/' + ROUTE.evacuation_center_id
    const CONFIG = { headers: { Authorization: `Bearer ${localStorage.getItem('q-drr-web-token')}` } }

    confirmAlert({
      title: 'Delete Evacuation Center Record',
      message: 'This evacuation center record will be permanently lost and you will not be able to recover it.',
      buttons: [
        {
          label: 'Delete',
          onClick: () => {
            axios
              .delete(URL, CONFIG)
              .then((response) => {
                if (response.status === 204) {
                  setStatus('success')
                  toast.success('Evacuation center record has been deleted')
                  navigate('/evacuation/centers')
                }
              })
              .catch((error) => {
                setStatus('success')
                if (error.response) {
                  if (error.response?.status === 403) toast.error('User credential is forbidden')
                  else if (error.response?.status === 404) toast.error('Evacuation center was not found')
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
          <SectionHeader bigTitle="Evacuation Center Information">
            <ButtonIcon
              onClick={() => navigate('/evacuation/centers/' + ROUTE.evacuation_center_id + '/edit')}
              status={status}
              title="Edit evacuation center record">
              <Edit20 />
            </ButtonIcon>
            <ButtonIcon color="red" onClick={deleteEvacuationCenter} status={status} title="Delete evacuation center record">
              <TrashCan20 />
            </ButtonIcon>
            <ButtonIcon
              color="gray"
              label="Back to Evacuation Center Records"
              onClick={() => navigate('/evacuation/centers', { replace: true })}
              status={status}
              title="Close">
              <ArrowLeft20 />
            </ButtonIcon>
          </SectionHeader>
          <SectionHeader title="1. Evacuation Center" />
          <SectionBody>
            <Field label="Name" status={status} text={Help.displayText(evacuationCenter.name)} />
            <Field label="Capacity" status={status} text={Help.displayNumberWithComma(evacuationCenter.capacity)} />
            <Field label="Government Owned" status={status}>
              <Toggle available={evacuationCenter.is_government_owned} />
            </Field>
          </SectionBody>
          <SectionBody>
            <Field label="Municipality" status={status} text={Help.displayText(evacuationCenter.municipal)} />
            <Field label="Barangay" status={status} text={Help.displayText(evacuationCenter.barangay)} />
          </SectionBody>
          <SectionBody>
            <Field label="Latitude" status={status} text={Help.displayNumber(evacuationCenter.latitude)} />
            <Field label="Longitude" status={status} text={Help.displayNumber(evacuationCenter.longitude)} />
          </SectionBody>
          <SectionBody>
            <div id="evacuation-center-map" className="map-container-evacuation-center" />
          </SectionBody>
          <SectionHeader title="2. Facilities" />
          <SectionBody>
            <Field label="Backup Power Source" status={status}>
              <Toggle available={evacuationCenter.facility_backup_power_source} />
            </Field>
            <Field label="Breastfeeding" status={status}>
              <Toggle available={evacuationCenter.facility_breastfeeding} />
            </Field>
            <Field label="Clinic" status={status}>
              <Toggle available={evacuationCenter.facility_clinic} />
            </Field>
            <Field label="Communication Room" status={status}>
              <Toggle available={evacuationCenter.facility_communication_room} />
            </Field>
            <Field label="Council" status={status}>
              <Toggle available={evacuationCenter.facility_council} />
            </Field>
            <Field label="Couples Room" status={status}>
              <Toggle available={evacuationCenter.facility_couples_room} />
            </Field>
            <Field label="Dining" status={status}>
              <Toggle available={evacuationCenter.facility_dining} />
            </Field>
            <Field label="Distillation Area" status={status}>
              <Toggle available={evacuationCenter.facility_distilation_area} />
            </Field>
            <Field label="Electrical Room" status={status}>
              <Toggle available={evacuationCenter.facility_electrical_room} />
            </Field>
            <Field label="Kitchen" status={status}>
              <Toggle available={evacuationCenter.facility_kitchen} />
            </Field>
            <Field label="Laundry Area" status={status}>
              <Toggle available={evacuationCenter.facility_laundry_area} />
            </Field>
            <Field label="Pharmacy" status={status}>
              <Toggle available={evacuationCenter.facility_pharmacy} />
            </Field>
            <Field label="Playroom" status={status}>
              <Toggle available={evacuationCenter.facility_play_room} />
            </Field>
            <Field label="Registration Area" status={status}>
              <Toggle available={evacuationCenter.facility_registration_area} />
            </Field>
            <Field label="Rest Room" status={status}>
              <Toggle available={evacuationCenter.facility_rest_room} />
            </Field>
            <Field label="Water Station" status={status}>
              <Toggle available={evacuationCenter.facility_water_station} />
            </Field>
          </SectionBody>
        </PaperView>
      </FadeAnimation>
    </PageContent>
  )
}

export default EvacuationCenterInformation
