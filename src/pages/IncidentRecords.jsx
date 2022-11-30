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
import getIncidents from '../api/getIncidents'
import { navigate } from '@reach/router'
import { toast } from 'react-toastify'

function IncidentRecords() {
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
  const [types, setTypes] = React.useState('')
  const [address_province, setAddressProvince] = React.useState(Account.vicinity_province)
  const [address_municipality, setAddressMunicipality] = React.useState(Account.vicinity_municipality)
  const [address_barangay, setAddressBarangay] = React.useState(Account.vicinity_barangay)
  const [params, setParams] = React.useState({ limit, page, orders })

  // SEND GET INCIDENTS REQUEST
  const Incidents = getIncidents(params)

  // UPDATE URL SEARCH PARAMETERS
  function updateParams() {
    let newParams = {}
    if (limit !== '') newParams.limit = limit
    if (page !== '') newParams.page = page
    if (orders !== '') newParams.orders = orders
    if (name !== '') newParams.name = name
    if (types !== '') newParams.types = types
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
  React.useEffect(() => updateParams(), [limit, page, orders, types, address_municipality, address_barangay])

  // ON GET INCIDENTS
  React.useEffect(() => {
    if (Incidents.loading) setStatus('loading')
    if (Incidents.error) setStatus('error')
    if (Incidents.data) {
      setStatus('success')
      setTotalCount(Incidents.data?.records.total)
    }
    return () => setStatus('loading')
  }, [Incidents.loading, Incidents.error, Incidents.data])

  // REFRESH AND RESET TABLE
  function refreshTable() {
    setStatus('loading')
    Incidents.mutate().then(() => {
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
              placeholder="Search by incident name"
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
          <ButtonIcon label="Refresh" onClick={refreshTable} status={status} title="Refresh and reset table">
            <Reset20 />
          </ButtonIcon>
          <CSVLink
            filename={`INCIDENTS.csv`}
            data={Incidents.data?.records.incidents || []}
            headers={[
              { label: 'ID', key: 'id' },
              { label: 'Name', key: 'name' },
              { label: 'Types', key: 'types' },
              { label: 'Other Type', key: 'types_ex' },
              { label: 'Municipality', key: 'municipal' },
              { label: 'Barangay', key: 'barangay' },
              { label: 'Purok', key: 'purok' },
              { label: 'Caller Name', key: 'caller_name' },
              { label: 'Caller Number', key: 'caller_number' },
              { label: 'Response Team', key: 'response_team' },
              { label: 'Response Vehicle', key: 'response_vehicle' },
              { label: 'Called At', key: 'called_at' },
              { label: 'Occured At', key: 'occured_at' },
              { label: 'Created At', key: 'created_at' },
              { label: 'Updated At', key: 'updated_at' }
            ]}>
            <ButtonIcon label="Download" status={status} title="Download current table">
              <Download20 />
            </ButtonIcon>
          </CSVLink>
          <Button color="green" onClick={() => navigate('/incidents/records/add')} status={status}>
            Create Incident Rescue Record
          </Button>
        </TableToolbar>
        <SearchBox className={display ? 'display' : 'hidden'}>
          <FormRow>
            <Field label="Type">
              <Select onChange={(e) => setTypes(e.target.value)} value={types}>
                <option value=""></option>
                <option value="trauma">TRAUMA</option>
                <option value="medical">MEDICAL</option>
                <option value="obstetric">OBSTETRIC</option>
                <option value="transfer">TRANSFER</option>
                <option value="vehicular">VEHICULAR</option>
                <option value="other">OTHER</option>
              </Select>
            </Field>
            <Field label="Municipality">
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
            <Field label="Barangay">
              <Select onChange={(e) => setAddressBarangay(e.target.value)} value={address_barangay}>
                <option value="">ALL BARANGAYS</option>
                {Address.Barangays('02', 'QUIRINO', address_municipality).map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Order By">
              <Select onChange={(e) => setOrders(e.target.value)} value={orders}>
                <option value="id:asc">ID (ASC)</option>
                <option value="id:desc">ID (DESC)</option>
                <option value="name:asc">NAME (ASC)</option>
                <option value="name:desc">NAME (DESC)</option>
                <option value="called_at:asc">CALLED AT (ASC)</option>
                <option value="called_at:desc">CALLED AT (DESC)</option>
                <option value="occured_at:asc">OCCURED AT (ASC)</option>
                <option value="occured_at:desc">OCCURED AT (DESC)</option>
                <option value="updated_at:asc">UPDATED AT (ASC)</option>
                <option value="updated_at:desc">UPDATED AT (DESC)</option>
              </Select>
            </Field>
          </FormRow>
        </SearchBox>
        <Table
          status={status}
          emptyLabel="No incidents found"
          headers={['Index', 'Incident ID', 'Date Occured', 'Name of Incident', 'Type of Incident', 'Address'].filter(Boolean)}
          total={totalCount}>
          {status === 'success' &&
            Incidents.data?.records.incidents.map((item, index) => {
              return (
                <tr key={index} onClick={() => navigate(`/incidents/records/${item.id}`)} title="Click to view more details">
                  <td>{Help.displayTableIndex(limit, page, index)}</td>
                  <td>{item.id}</td>
                  <td>{Help.displayDate(item.occured_at)}</td>
                  <td>{item.name}</td>
                  <td>{Help.displayTags(item.types)}</td>
                  <td>
                    {item.municipal}, {item.barangay}
                  </td>
                </tr>
              )
            })}
        </Table>
        <TableFooter
          status={status}
          label="Incidents"
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

export default IncidentRecords
