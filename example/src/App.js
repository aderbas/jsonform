import React from 'react'

import JsonForm from 'jsonform'

const RE_EMAIL = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const fetchList = () => new window.Promise(resolve => {
  fetch('https://api.randomuser.me/?results=5')
    .then(res => res.json())
    .then(json => resolve(json.results.map((row, k) => ({
      label: `${row.name.first} ${row.name.last}`, value: k
    }))))
    .catch(() => resolve([]));
});

export const fetchObject = () => new window.Promise(resolve => {
  fetch('https://api.randomuser.me/?results=1')
    .then(res => res.json())
    .then(json => resolve(json.results[0]))
    .catch(() => resolve([]));
});

const simpleForm = {
	// 'gender': {
	// 	component: 'text',
	// 	props: {
	// 		label: 'Gender',
	// 	},
	// }, 
  'email': {
		component: 'text',
		props: {
			label: 'Email',
		}  
  },
  'gender': {
    component: 'radiogroup',
    props: {
      label: 'Gender',
      options: [{value: 'male', label: 'Male'},{value: 'female', label: 'Female'}],
    },
    options: {
      depends: {
        rules: [
          {field: 'email', regex: RE_EMAIL}
        ]
      }
    }    
  }  
}

const App = () => {
  return (
    <JsonForm 
      title="My Form"
      components={simpleForm}
      controlOptions={{
        saveText: 'Save Form',
        boxProps: {
          textAlign: 'right'
        }
      }}
      fetchData={fetchObject}
      onSave={(data) => console.log(data)}
    />
  )
}

export default App