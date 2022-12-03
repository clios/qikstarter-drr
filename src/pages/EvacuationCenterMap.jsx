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
import getEvacuationCenterLocations from '../api/getEvacuationCenterLocations'
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

const EVACUATION_CENTER_LOCATIONS = 'evacuation-center-locations'
const EVACUATION_CENTER_LOCATIONS_COLOR = '#df2020'

function EvacuationCenterMap() {
  // INFORMATION STATE
  const Account = React.useContext(AccountContext)
  const [status, setStatus] = React.useState('success')
  const [display, setDisplay] = React.useState(false)
  const [map, setMap] = React.useState(false)

  // INPUT STATE
  const [evacuation_center_locations_filter, setEvacuationCenterLocationsFilter] = React.useState(true)
  const [boundaries_filter, setBoundariesFilter] = React.useState(true)
  const [municipality, setMunicipality] = React.useState('')
  const [barangay, setBarangay] = React.useState('')
  // INPUT STATE: PARAMS
  const [params, setParams] = React.useState({ municipal: municipality, barangay })

  // SEND GET EVACUATION CENTER LOCATIONS REQUEST
  const EvacuationCenterLocations = getEvacuationCenterLocations(params)

  // UPDATE URL SEARCH PARAMETERS
  function updateParams() {
    let newParams = {}
    if (municipality !== '') newParams.municipal = municipality
    if (barangay !== '') newParams.barangay = barangay
    setParams(newParams)
  }

  // ON QUICK UPDATE OF PARAMS
  React.useEffect(() => updateParams(), [municipality, barangay])

  // ON GET EVACUATION CENTER LOCATIONS
  React.useEffect(() => {
    if (EvacuationCenterLocations.loading) setStatus('loading')
    if (EvacuationCenterLocations.error) setStatus('error')
    if (EvacuationCenterLocations.data) setStatus('success')
    return () => setStatus('loading')
  }, [EvacuationCenterLocations.loading, EvacuationCenterLocations.error, EvacuationCenterLocations.data])

  // ON RENDER, REVALIDATE EVACUATION CENTER AND CREATE MAP
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

  // ON LOAD EVACUATION CENTER DATA
  React.useEffect(() => {
    setStatus('loading')
    if (map && EvacuationCenterLocations.data) {
      map.resize()

      // CREATE EVACUATION CENTER GEOJSON
      const evacuation_center_records = EvacuationCenterLocations.data.records
      const evacuation_center_geojson = mapGeoJSON(map, EVACUATION_CENTER_LOCATIONS, evacuation_center_records, (item) => {
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

        // EVACUATION CENTER LOCATIONS
        map.addImage(EVACUATION_CENTER_LOCATIONS, mapMarker(100, EVACUATION_CENTER_LOCATIONS_COLOR, map), { pixelRatio: 2 })
        mapSource(map, EVACUATION_CENTER_LOCATIONS, { type: 'geojson', data: evacuation_center_geojson, cluster: true })
        mapLayer.cluster(map, EVACUATION_CENTER_LOCATIONS, EVACUATION_CENTER_LOCATIONS_COLOR)
        mapLayer.clusterCount(map, EVACUATION_CENTER_LOCATIONS)
        mapLayer.unclusteredPoint(map, EVACUATION_CENTER_LOCATIONS, EVACUATION_CENTER_LOCATIONS)
        mapEvent.mouse(map, EVACUATION_CENTER_LOCATIONS)
        mapEvent.clickCluster(map, EVACUATION_CENTER_LOCATIONS)
        mapEvent.clickUnclusteredPoint(map, EVACUATION_CENTER_LOCATIONS, (properties) => {
          confirmAlert({
            title: properties.name,
            message: `Evacuation Center Location`,
            buttons: [{ label: 'Go to records', onClick: () => navigate('/evacuation/centers/' + properties.id) }, { label: 'Close' }]
          })
        })
      })

      map.on('idle', () => {
        setStatus('success')
      })
    }
  }, [map, EvacuationCenterLocations.data])

  // ADD MAP LAYER TOGGLE
  React.useEffect(() => {
    if (map) {
      function toggleMapLayer(map, layer, filter) {
        if (map.getLayer(layer)) map.setLayoutProperty(layer, 'visibility', filter ? 'visible' : 'none')
      }

      toggleMapLayer(map, 'evacuation-center-locations-cluster-layer', evacuation_center_locations_filter)
      toggleMapLayer(map, 'evacuation-center-locations-cluster-count-layer', evacuation_center_locations_filter)
      toggleMapLayer(map, 'evacuation-center-locations-unclustered-point-layer', evacuation_center_locations_filter)

      toggleMapLayer(map, 'boundaries-fill-layer', boundaries_filter)
      toggleMapLayer(map, 'boundaries-line-layer', boundaries_filter)
    }
  }, [map, evacuation_center_locations_filter, boundaries_filter])

  // REFRESH
  function refreshLocations() {
    setStatus('loading')
    EvacuationCenterLocations.mutate().then(() => {
      setStatus('success')
    })
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
              <Field label="Evacuation Centers" status={status}>
                <Checkbox
                  checked={evacuation_center_locations_filter}
                  onChange={(e) => setEvacuationCenterLocationsFilter(e.target.checked)}
                  text={evacuation_center_locations_filter ? 'Display' : 'Hidden'}
                />
              </Field>
            </FormRow>
            <FormRow>
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

export default EvacuationCenterMap
