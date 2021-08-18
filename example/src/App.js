import React from 'react'

import JsonForm from 'jsonform'

export const fetchList = () => new window.Promise(resolve => {
  fetch('https://api.randomuser.me/?results=5')
    .then(res => res.json())
    .then(json => resolve(json.results.map((row, k) => ({
      label: `${row.name.first} ${row.name.last}`, value: k
    }))))
    .catch(() => resolve([]));
});


const simpleForm = {
  'user_name': {
    component: 'text',
    props: {
      label: 'Name',
    }
  },
	'user_enabled': {
		component: 'switch',
		props: {
			label: 'Block',
		},
		options: {
			skipFromModel: true
		}
	},
  'user_obs': {
    component: 'text',
		props: {
			label: 'Block OBS',
			multiline: true,
			rows: 4
		},
  },
	'user_type': {
		component: 'select',
		props: {
			label: 'Type',
			options: [{value: 1, label: 'Default'}, {value: 2, label: 'Admin'}]
		},
		options: {
			depends: 'user_enabled'
		}		
	},	
}

const App = () => {
  return (
    <JsonForm 
      title="My Form"
      components={simpleForm}
      controlOptions={{
        saveText: 'Save Form'
      }}
      onSave={(data) => console.log(data)}
    />
  )
}

export default App