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

const MyModel = {
  user_name: 'Tom',
  user_email: 'tom@email.com',
  user_gender: 'male'
}

const formFields = [
	[{
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
      }
    }
  }, {
    'info': {
      component: 'info',
      props: {
        text: 'Tip: Use a non commercial email.'
      },
      options: {
        skipFromModel: true
      }
    },
    'user_gender': {
      component: 'radiogroup',
      props: {
        label: '',
        options: [{
          value: 'male',
          label: 'Male'
        }, {
          value: 'female',
          label: 'Female'
        }, {
          value: 'unknow',
          label: 'Unknow'
        }],
        value: 'male'
      }
    }
  }], [{
		'user_password': {
			component: 'text',
			props: {
				label: 'Password',
				type: 'password'
			}
		},
		'user_repassword': {
			component: 'text',
			props: {
				label: 'Confirm password',
				type: 'password',
			},
			options: {
				skipFromModel: true,
        depends: 'user_password'
			}
		},
		'user_type': {
			component: 'select',
			props: {
				label: 'Select',
        hint: 'Select Type',
				options: fetchList
			}
		},
    'user_names': {
      component: 'select',
      props: {
        label: 'Names',
        options: fetchList
      },
      options: {
        depends: 'user_type'
      }
    }
	}, {
		'user_notes': {
			component: 'text',
			props: {
				label: 'Notes',
				multiline: true,
				rows: 4
			}
		}
	}]
]

// const simpleForm = {
//   'user_name': {
//     component: 'text',
//     props: {
//       label: 'Name',
//     }
//   },
//   'user_email': {
//     component: 'text',
//     props: {
//       label: 'E-mail',
//     }
//   }
// }

const App = () => {
  return (
    <JsonForm 
      title="My Form"
      components={formFields} 
      controlOptions={{
        saveText: 'Save Form'
      }}
      model={MyModel}
      onSave={(data) => console.log(data)}
    />
  )
}

export default App
