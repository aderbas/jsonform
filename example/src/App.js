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

export const fetchObject = () => new window.Promise(resolve => {
  fetch('https://api.randomuser.me/?results=1')
    .then(res => res.json())
    .then(json => resolve({user_has_domain: json.results[0].gender === 'male', ...json.results[0]}))
    .catch(() => resolve([]));
});

const simpleForm = {
  'user_has_domain': {
    component: 'switch',
    props: {
      label: 'Use domain',
    }
  },
  //without rule
  'user_domain_external': {
    component: 'switch',
    props: {
      label: 'External domain',
    },
    options: {
      depends: 'user_has_domain'
    }
  },
  'gender': {
    component: 'select',
    props: {
      label: 'Gender',
      options: [{value: 'male', label: 'Male'},{value: 'female', label: 'Female'}]
    },
    options: {
      depends: 'user_has_domain'
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