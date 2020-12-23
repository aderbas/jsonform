import React from 'react'

import JsonForm from 'jsonform'
import 'jsonform/dist/index.css'

const fetchList = () => new window.Promise(resolve => {
  fetch('https://api.randomuser.me/?results=5')
    .then(res => res.json())
    .then(json => resolve(json.results.map(row => ({
      label: `${row.name.first} ${row.name.last}`, value: row.id.value
    }))))
    .catch(() => resolve([]));
});

const fields = {
  'name': {
    component: 'text',
    props: {
      label: 'Name',
      value: 'Lorem Ipsum',
      required: true
    }
  },
  'user': {
    component: 'select',
    props: {
      label: 'User',
      options: fetchList,
      required: true
    }
  }
}

const App = () => {
  return (
    <JsonForm 
      components={fields} 
      onSave={(data) => console.log(data)}
    />
  )
}

export default App
