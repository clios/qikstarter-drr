import Help from '../Help'
import React from 'react'

function Button(props) {
  const no_permission_required = Boolean(!props.permissions) && Boolean(!props.permission)
  const isPermitted = Help.checkPermission(props.permissions, props.permission)
  const color = props.color ? 'is-' + props.color : 'is-blue'

  if (no_permission_required || isPermitted)
    return (
      <button className={`button ${color} ${props.className}`} onClick={props.onClick} disabled={props.disabled}>
        {props.status === 'loading' ? props.loadingText : props.children}
      </button>
    )

  if (!isPermitted) return null
}

export default Button
