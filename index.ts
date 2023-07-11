import React from 'react'

if (typeof React === 'undefined') {
  throw new Error('The react is not installed. Please make sure to install it.')
}

export { create } from './create'