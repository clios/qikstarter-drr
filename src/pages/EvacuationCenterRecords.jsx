import { Add20, Download20, Filter20, Reset20 } from '@carbon/icons-react'

import AccountContext from '../contexts/AccountContext'
import Address from '../Address'
import Authorization from '../components/Authorization'
import Button from '../components/Button'
import ButtonIcon from '../components/ButtonIcon'
import { CSVLink } from 'react-csv'
import FadeAnimation from '../components/FadeAnimation'
import Field from '../components/Field'
import FormRow from '../components/FormRow'
import Help from '../Help'
import Input from '../components/Input'
import PageContent from '../components/PageContent'
import PaperView from '../components/PaperView'
import React from 'react'
import SearchBox from '../components/SearchBox'
import Select from '../components/Select'
import Table from '../components/Table'
import TableFooter from '../components/TableFooter'
import TableToolbar from '../components/TableToolbar'
import getEvacuationCenters from '../api/getEvacuationCenters'
import { navigate } from '@reach/router'
import { toast } from 'react-toastify'

function EvacuationCenterRecords() {
  // INFORMATION STATE
  const Account = React.useContext(AccountContext)
  const [status, setStatus] = React.useState('loading')
  const [display, setDisplay] = React.useState(false)
  const [totalCount, setTotalCount] = React.useState(0)

  // INPUT STATE
  const [limit, setLimit] = React.useState(50)
  const [page, setPage] = React.useState(1)
  const [orders, setOrders] = React.useState('updated_at:desc')
  const [name, setName] = React.useState('')
  const [address_municipality, setAddressMunicipality] = React.useState('')
  const [address_barangay, setAddressBarangay] = React.useState('')
  const [params, setParams] = React.useState({ limit, page, orders })

  // SEND GET EVACUATION CENTERS REQUEST
  const EvacuationCenters = getEvacuationCenters(params)

  // UPDATE URL SEARCH PARAMETERS
  function updateParams() {
    let newParams = {}
    if (limit !== '') newParams.limit = limit
    if (page !== '') newParams.page = page
    if (orders !== '') newParams.orders = orders
    if (name !== '') newParams.name = name
    if (address_municipality !== '') newParams.municipal = address_municipality
    if (address_barangay !== '') newParams.barangay = address_barangay
    setParams(newParams)
  }

  // ON DELAYED UPDATE OF PARAMS
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => updateParams() && setPage(1), 1000)
    return () => clearTimeout(delayDebounceFn)
  }, [name])

  // ON QUICK UPDATE OF PARAMS
  React.useEffect(() => updateParams(), [limit, page, orders, address_municipality, address_barangay])

  // ON GET EVACUATION CENTERS
  React.useEffect(() => {
    if (EvacuationCenters.loading) setStatus('loading')
    if (EvacuationCenters.error) setStatus('error')
    if (EvacuationCenters.data) {
      setStatus('success')
      setTotalCount(EvacuationCenters.data?.records.total)
    }
    return () => setStatus('loading')
  }, [EvacuationCenters.loading, EvacuationCenters.error, EvacuationCenters.data])

  // REFRESH AND RESET TABLE
  function refreshTable() {
    setStatus('loading')
    EvacuationCenters.mutate().then(() => {
      setStatus('success')
    })
  }

  return (
    <PageContent>
      <FadeAnimation>
        <TableToolbar
          mainChild={
            <Input
              onChange={(e) => setName(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && updateParams()}
              placeholder="Search by evacuation center name"
              value={name}
            />
          }>
          <ButtonIcon
            label="Filter"
            onClick={() => setDisplay(!display)}
            title={display ? 'Hide filter options' : 'Display more filter options'}
            status={status}>
            <Filter20 />
          </ButtonIcon>
          <ButtonIcon label="Reset" onClick={refreshTable} status={status} title="Refresh and reset table">
            <Reset20 />
          </ButtonIcon>
          <CSVLink
            filename={`EVACUATION CENTERS.csv`}
            data={EvacuationCenters.data?.records.evacuation_centers || []}
            headers={[
              { label: 'ID', key: 'id' },
              { label: 'Name', key: 'name' },
              { label: 'Capacity', key: 'capacity' },
              { label: 'Municipal', key: 'municipal' },
              { label: 'Barangay', key: 'barangay' },
              { label: 'Purok', key: 'purok' },
              { label: 'Latitude', key: 'latitude' },
              { label: 'Longitude', key: 'longitude' },
              { label: 'Backup Power Source', key: 'facility_backup_power_source' },
              { label: 'Breastfeeding', key: 'facility_breastfeeding' },
              { label: 'Clinic', key: 'facility_clinic' },
              { label: 'Communication Room', key: 'facility_communication_room' },
              { label: 'Council', key: 'facility_council' },
              { label: 'Couples Room', key: 'facility_couples_room' },
              { label: 'Dining', key: 'facility_dining' },
              { label: 'Distilation Area', key: 'facility_distilation_area' },
              { label: 'Electrical Room', key: 'facility_electrical_room' },
              { label: 'Kitchen', key: 'facility_kitchen' },
              { label: 'Laundry Area', key: 'facility_laundry_area' },
              { label: 'Pharmacy', key: 'facility_pharmacy' },
              { label: 'Play Room', key: 'facility_play_room' },
              { label: 'Registration Area', key: 'facility_registration_area' },
              { label: 'Rest Room', key: 'facility_rest_room' },
              { label: 'Water Station', key: 'facility_water_station' },
              { label: 'Is Government Owned', key: 'is_government_owned' },
              { label: 'Created At', key: 'created_at' },
              { label: 'Updated At', key: 'updated_at' }
            ]}>
            <ButtonIcon label="Download" status={status} title="Download current table">
              <Download20 />
            </ButtonIcon>
          </CSVLink>
          <Button color="green" onClick={() => navigate('/evacuation/centers/add')} status={status}>
            Creaate Evacuation Center Record
          </Button>
        </TableToolbar>
        <SearchBox className={display ? 'display' : 'hidden'}>
          <FormRow>
            <Field label="Municipality" status={status}>
              <Select
                onChange={(e) => {
                  setAddressBarangay('')
                  setAddressMunicipality(e.target.value)
                }}
                value={address_municipality}>
                <option value="">ALL MUNICIPALS</option>
                {Address.Municipalities('02', 'QUIRINO').map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Barangay" status={status}>
              <Select onChange={(e) => setAddressBarangay(e.target.value)} value={address_barangay}>
                <option value="">ALL BARANGAYS</option>
                {Address.Barangays('02', 'QUIRINO', address_municipality).map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Order By" status={status}>
              <Select onChange={(e) => setOrders(e.target.value)} value={orders}>
                <option value="name:desc">NAME (DESC)</option>
                <option value="name:asc">NAME (ASC)</option>
                <option value="capacity:desc">CAPACITY (DESC)</option>
                <option value="capacity:asc">CAPACITY (ASC)</option>
                <option value="name:desc">DATE OCCURED (DESC)</option>
                <option value="name:asc">DATE OCCURED (ASC)</option>
              </Select>
            </Field>
          </FormRow>
        </SearchBox>
        <Table
          status={status}
          emptyLabel="No evacuation centers found"
          headers={['Index', 'Name', 'Capacity', 'Address'].filter(Boolean)}
          total={totalCount}>
          {status === 'success' &&
            EvacuationCenters.data?.records.evacuation_centers.map((item, index) => {
              return (
                <tr key={index} onClick={() => navigate(`/evacuation/centers/${item.id}`)} title="Click to view more details">
                  <td>{Help.displayTableIndex(limit, page, index)}</td>
                  <td>{item.name?.toUpperCase()}</td>
                  <td>{Help.displayNumberWithComma(item.capacity)}</td>
                  <td>
                    {item.municipal}, {item.barangay}
                  </td>
                </tr>
              )
            })}
        </Table>
        <TableFooter
          status={status}
          label="Evacuation Centers"
          page={page}
          limit={limit}
          total={totalCount}
          onUpdatePage={(data) => setPage(data)}
          onUpdateLimit={(data) => setLimit(data)}
        />
      </FadeAnimation>
    </PageContent>
  )
}

export default EvacuationCenterRecords
