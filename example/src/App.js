import React from 'react'

import JsonForm from 'jsonform'
import 'jsonform/dist/index.css'

const fields = {
  'name': {
    component: 'text',
    props: {
      label: 'Name',
      value: 'Lorem Ipsum'
    }
  },
}

const App = () => {
  return <JsonForm components={fields} />
}

export default App
