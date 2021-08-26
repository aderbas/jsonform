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
	'user_type': {
		component: 'select',
		props: {
			label: 'Type',
			options: [{value: 0, label: 'Default'}, {value: 2, label: 'Admin'}]
		},
	},	
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
      onSave={(data) => console.log(data)}
    />
  )
}

export default App