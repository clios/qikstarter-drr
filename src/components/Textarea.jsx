import './Textarea.css'

import React from 'react'

function Textarea(props) {
  const styleName = ['textarea', props.className, props.uppercase && 'uppercase'].filter(Boolean).join(' ').trim()

  return (
    <textarea
      className={styleName}
      defaultValue={props.defaultValue}
      disabled={props.disabled}
      onChange={props.onChange}
      placeholder={props.placeholder}
      required={props.required}
      size={props.size}
      value={props.value}
      cols={props.cols}
    />
  )
}

export default Textarea
