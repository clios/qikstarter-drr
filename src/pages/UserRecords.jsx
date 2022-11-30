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
import React from 'react'
import SearchBox from '../components/SearchBox'
import Select from '../components/Select'
import Table from '../components/Table'
import TableFooter from '../components/TableFooter'
import TableToolbar from '../components/TableToolbar'
import getUsers from '../api/getUsers'
import { navigate } from '@reach/router'
import { toast } from 'react-toastify'

function UserRecords() {
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
  const [deactivated, setDeactivated] = React.useState('')
  const [params, setParams] = React.useState({ limit, page, orders })

  // SEND GET USERS REQUEST
  const Users = getUsers(params)

  // UPDATE URL SEARCH PARAMETERS
  function updateParams() {
    let newParams = {}
    if (limit !== '') newParams.limit = limit
    if (page !== '') newParams.page = page
    if (orders !== '') newParams.orders = orders
    if (name !== '') newParams.name = name
    if (deactivated !== '') newParams.deactivated = deactivated
    setParams(newParams)
  }

  // ON DELAYED UPDATE OF PARAMS
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      updateParams()
      setPage(1)
    }, 1000)
    return () => clearTimeout(delayDebounceFn)
  }, [name])

  // ON QUICK UPDATE OF PARAMS
  React.useEffect(() => updateParams(), [limit, page, orders, deactivated])

  // ON GET USERS
  React.useEffect(() => {
    if (Users.loading) setStatus('loading')
    if (Users.error) setStatus('error')
    if (Users.data) {
      setStatus('success')
      setTotalCount(Users.data?.records.total)
    }
    return () => setStatus('loading')
  }, [Users.loading, Users.error, Users.data])

  // REFRESH AND RESET TABLE
  function refreshTable() {
    setStatus('loading')
    Users.mutate().then(() => {
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
              placeholder="Search by name"
              value={name}
            />
          }>
          <ButtonIcon label="Refresh" onClick={refreshTable} status={status} title="Refresh and reset table">
            <Reset20 />
          </ButtonIcon>
          <Button color="green" onClick={() => navigate('/users/records/add')} status={status}>
            Create User Account
          </Button>
        </TableToolbar>
        <Table status={status} emptyLabel="No users found" headers={['Index', 'Name', 'Office', 'Status', 'Date Updated']} total={totalCount}>
          {status === 'success' &&
            Users.data?.records.users.map((item, index) => {
              return (
                <tr key={index} onClick={() => navigate(`/users/records/${item.id}`)} title="Click to view more details">
                  <td>{Help.displayTableIndex(limit, page, index)}</td>
                  <td>{item.name}</td>
                  <td>{item.office || 'NOT FOUND'}</td>
                  <td className={item.inactive ? 'text-red' : 'text-green'}>{item.inactive ? 'UNAUTHORIZED' : 'AUTHORIZED'}</td>
                  <td>{Help.displayDate(item.updated_at)}</td>
                </tr>
              )
            })}
        </Table>
        <TableFooter
          status={status}
          label="Users"
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

export default UserRecords
