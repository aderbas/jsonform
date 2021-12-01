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

export const fetchObject = (d) => new window.Promise(resolve => {
  fetch('https://api.randomuser.me/?results=1')
    .then(res => res.json())
    .then(json => resolve({user_has_domain: json.results[0].gender === 'male', ...json.results[0]}))
    .catch(() => resolve([]));
});

const simpleForm = {
  'user_name': {
    component: 'text',
    props: {
      label: 'Name'
    }
  },
  'user_email': {
    component: 'text',
    props: {
      label: 'Email'
    }
  },
  'user_type': {
    component: 'select',
    props: {
      options: [{label: 'Admin'},{label: 'Default'}],
      label: 'Type'
    }
  } 
}

const App = () => {
  return (
    <JsonForm 
      title={<h1>My Form</h1>}
      secondary={<div>Help Text here</div>}
      components={simpleForm}
      controlOptions={{
        saveText: 'Save Form',
        boxProps: {
          textAlign: 'right'
        },
        confirmSave: 'Deseja realmente salvar?',
        confirmCancel: 'Deseja cancelar?',
        confirmButtonsLabel: {
          no: 'Não', yes: 'Sim'
        }
      }}
      fetchData={fetchObject}
      fetchParams={11}
      onSave={(data) => console.log(data)}
      onCancel={() => console.log('Cancel')}
    />
  )
}

export default App