import React from 'react'

import JsonForm from 'jsonform'
import 'jsonform/dist/index.css'

export const fetchList = () => new window.Promise(resolve => {
  fetch('https://api.randomuser.me/?results=5')
    .then(res => res.json())
    .then(json => resolve(json.results.map(row => ({
      label: `${row.name.first} ${row.name.last}`, value: row.id.value
    }))))
    .catch(() => resolve([]));
});

const formFields = [{
  'user_name': {
    component: 'text',
    props: {
      label: 'Name',
      required: true
    }
  },
  'user_email': {
    component: 'text',
    props: {
      label: 'E-mail',
      required: true
    }
  },
}, {
  'user_password': {
    component: 'text',
    props: {
      label: 'Password',
      required: true,
      type: 'password'
    }
  },
  'user_repassword': {
    component: 'text',
    props: {
      label: 'Confirm password',
      required: true,
      type: 'password'
    }
  }   
}]

const App = () => {
  return (
    <JsonForm 
      components={formFields} 
      controlOptions={{
        saveText: 'Save Form'
      }}
      onSave={(data) => console.log(data)}
    />
  )
}

export default App
