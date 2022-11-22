import { DPI, Format, MapboxExportControl, PageOrientation, Size } from '@watergis/mapbox-gl-export'
import { Filter20, Reset20 } from '@carbon/icons-react'

import AccountContext from '../contexts/AccountContext'
import Address from '../Address'
import Authorization from '../components/Authorization'
import ButtonIcon from '../components/ButtonIcon'
import Checkbox from '../components/Checkbox'
import Disasters from '../Disasters'
import FadeAnimation from '../components/FadeAnimation'
import Field from '../components/Field'
import FormRow from '../components/FormRow'
import Loader from '../components/Loader'
import PageContent from '../components/PageContent'
import React from 'react'
import SearchBox from '../components/SearchBox'
import Select from '../components/Select'
import TableToolbar from '../components/TableToolbar'
import boundaries from '../geojson/boundaries.geojson'
import { confirmAlert } from 'react-confirm-alert'
import getIncidentLocations from '../api/getIncidentLocations'
import mapDEM from '../mapDEM'
import mapEvent from '../mapEvent'
import mapGeoJSON from '../mapGeoJSON'
import mapLayer from '../mapLayer'
import mapMarker from '../mapMarker'
import mapSource from '../mapSource'
import mapboxgl from 'mapbox-gl'
import { navigate } from '@reach/router'
import { toast } from 'react-toastify'

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN
mapboxgl.prewarm()

const INCIDENT_LOCATIONS = 'incident-locations'
const INCIDENT_LOCATIONS_COLOR = '#df2020'

function IncidentMap() {
  // INFORMATION STATE
  const Account = React.useContext(AccountContext)
  const [status, setStatus] = React.useState('success')
  const [display, setDisplay] = React.useState(false)
  const [map, setMap] = React.useState(false)

  // INPUT STATE
  const [incident_locations_filter, setIncidentLocationsFilter] = React.useState(true)
  const [boundaries_filter, setBoundariesFilter] = React.useState(true)
  const [year, setYear] = React.useState(2022)
  const [municipality, setMunicipality] = React.useState('')
  const [barangay, setBarangay] = React.useState('')
  // INPUT STATE: PARAMS
  const [params, setParams] = React.useState({ year, municipality, barangay })

  // SEND GET INCIDENT LOCATIONS REQUEST
  const IncidentLocations = getIncidentLocations(params)

  // UPDATE URL SEARCH PARAMETERS
  function updateParams() {
    let newParams = {}
    if (year !== '') newParams.year = year
    if (municipality !== '') newParams.municipality = municipality
    if (barangay !== '') newParams.barangay = barangay
    setParams(newParams)
  }

  // ON QUICK UPDATE OF PARAMS
  React.useEffect(() => updateParams(), [year, municipality, barangay])

  // ON GET INCIDENT LOCATIONS
  React.useEffect(() => {
    if (IncidentLocations.loading) setStatus('loading')
    if (IncidentLocations.error) setStatus('error')
    if (IncidentLocations.data) setStatus('success')
    return () => setStatus('loading')
  }, [IncidentLocations.loading, IncidentLocations.error, IncidentLocations.data])

  // ON RENDER, REVALIDATE INCIDENT AND CREATE MAP
  React.useEffect(() => {
    setMap(
      new mapboxgl.Map({
        center: [121.647584, 16.323105],
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-streets-v11',
        zoom: 8
      })
    )
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

  // ON LOAD INCIDENT AND FARM DATA
  React.useEffect(() => {
    setStatus('loading')
    if (map && IncidentLocations.data) {
      map.resize()

      // CREATE INCIDENT GEOJSON
      const incident_records = IncidentLocations.data.records
      const incident_geojson = mapGeoJSON(map, INCIDENT_LOCATIONS, incident_records, (item) => {
        return {
          'type': 'Feature',
          'geometry': { 'type': 'Point', 'coordinates': [item.longitude, item.latitude] },
          'properties': { 'id': item.id, 'name': item.name }
        }
      })

      // ON LOAD
      map.on('load', () => {
        // QUIRINO BARANGAY BOUNDARIES
        map.addSource('boundaries', { type: 'geojson', data: boundaries })
        mapLayer.boundaries(map)
        map.on('click', 'boundaries-fill-layer', (e) => {
          const properties = e.features[0].properties
          toast.info(
            <div>
              {properties.BRGY || 'N/A'}, {properties.MUN}
              <br />
              Area: {properties.AREA__HA_?.toLocaleString()} hectares
            </div>
          )
        })

        // INCIDENT LOCATIONS
        map.addImage(INCIDENT_LOCATIONS, mapMarker(100, INCIDENT_LOCATIONS_COLOR, map), { pixelRatio: 2 })
        mapSource(map, INCIDENT_LOCATIONS, { type: 'geojson', data: incident_geojson, cluster: true })
        mapLayer.cluster(map, INCIDENT_LOCATIONS, INCIDENT_LOCATIONS_COLOR)
        mapLayer.clusterCount(map, INCIDENT_LOCATIONS)
        mapLayer.unclusteredPoint(map, INCIDENT_LOCATIONS, INCIDENT_LOCATIONS)
        mapEvent.mouse(map, INCIDENT_LOCATIONS)
        mapEvent.clickCluster(map, INCIDENT_LOCATIONS)
        mapEvent.clickUnclusteredPoint(map, INCIDENT_LOCATIONS, (properties) => {
          confirmAlert({
            title: properties.name,
            message: `Incident Location`,
            buttons: [{ label: 'Go to records', onClick: () => navigate('/incidents/records/' + properties.id) }, { label: 'Close' }]
          })
        })
      })

      map.on('idle', () => {
        setStatus('success')
      })
    }
  }, [map, IncidentLocations.data])

  // ADD MAP LAYER TOGGLE
  React.useEffect(() => {
    if (map) {
      function toggleMapLayer(map, layer, filter) {
        if (map.getLayer(layer)) map.setLayoutProperty(layer, 'visibility', filter ? 'visible' : 'none')
      }

      toggleMapLayer(map, 'incident-locations-cluster-layer', incident_locations_filter)
      toggleMapLayer(map, 'incident-locations-cluster-count-layer', incident_locations_filter)
      toggleMapLayer(map, 'incident-locations-unclustered-point-layer', incident_locations_filter)

      toggleMapLayer(map, 'boundaries-fill-layer', boundaries_filter)
      toggleMapLayer(map, 'boundaries-line-layer', boundaries_filter)
    }
  }, [map, incident_locations_filter, boundaries_filter])

  // ON QUICK UPDATE OF PARAMS
  React.useEffect(() => updateParams(), [year, municipality, barangay])

  // REFRESH AND RESET TABLE
  function refreshLocations() {
    setStatus('loading')
    setTimeout(() => {
      setStatus('success')
      IncidentLocations.mutate()
    }, 500)
  }

  return (
    <React.Fragment>
      {status === 'loading' && <Loader />}
      <PageContent>
        <FadeAnimation>
          <TableToolbar>
            <ButtonIcon
              label="Filters"
              onClick={() => setDisplay(!display)}
              title={display ? 'Hide filter options' : 'Display more filter options'}
              status={status}>
              <Filter20 />
            </ButtonIcon>
            <ButtonIcon label="Refresh" status={status} onClick={() => refreshLocations()}>
              <Reset20 />
            </ButtonIcon>
          </TableToolbar>
          <SearchBox className={display ? 'display' : 'hidden'}>
            <FormRow>
              <Field label="Boundaries" status={status}>
                <Checkbox
                  checked={boundaries_filter}
                  onChange={(e) => setBoundariesFilter(e.target.checked)}
                  text={boundaries_filter ? 'Display' : 'Hidden'}
                />
              </Field>
              <Field label="Incidents" status={status}>
                <Checkbox
                  checked={incident_locations_filter}
                  onChange={(e) => setIncidentLocationsFilter(e.target.checked)}
                  text={incident_locations_filter ? 'Display' : 'Hidden'}
                />
              </Field>
            </FormRow>
            <FormRow>
              <Field label="Year" status={status}>
                <Select onChange={(e) => setYear(e.target.value)} value={year}>
                  <option value={2022}>2022</option>
                  <option value={2023}>2023</option>
                  ))
                </Select>
              </Field>
              <Field label="Municipality" status={status}>
                <Select
                  onChange={(e) => {
                    setBarangay('')
                    setMunicipality(e.target.value)
                  }}
                  value={municipality}>
                  <option value="">ALL MUNICIPALS</option>
                  {Address.Municipalities('02', 'QUIRINO').map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Barangay" status={status}>
                <Select onChange={(e) => setBarangay(e.target.value)} value={barangay}>
                  <option value="">ALL BARANGAYS</option>
                  {Address.Barangays('02', 'QUIRINO', municipality).map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </Field>
            </FormRow>
          </SearchBox>
          <div id="map" className="map-container" />
        </FadeAnimation>
      </PageContent>
    </React.Fragment>
  )
}

export default IncidentMap
