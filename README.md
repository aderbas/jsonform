# jsonform

> Create material design form from a JSON object

[![NPM](https://img.shields.io/npm/v/jsonform.svg)](https://www.npmjs.com/package/jsonform) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Dev Dependencies
* [Material-UI](https://material-ui.com/pt/)

## Table of Contents
1. [Install](#install)
2. [Basic Usage](#basic-usage)
3. [Popule form with remote data](#popule-form-with-remote-data)
4. [Split form into columns](#split-form-into-columns)
5. [Custom components](#custom-components)
6. [Elements](#elements)
7. [Options](#options)
8. [Popule with a model](#popule-with-a-model)
9. [License](#license)

## Install

```bash
$ npm i --save @aderbalnunes/react-jsonform
```

## Basic Usage

```jsx
import React, { Component } from 'react'

import JsonForm from 'jsonform'

const formFields = {
  'name': {
    component: 'text',
    props: {
      label: 'Name',
      required: true
    }
  },
  'email': {
    component: 'text',
    props: {
      label: 'Email',
      required: true
    }    
  }
}

class MyClass extends Component {
  render() {
    return (
      <JsonForm 
        components={formFields}
        onSave={(data) => console.log(data)}
      />
    )
  }
}
```
## Popule form with remote data

```jsx
const formFields = {
  'user_name': {
    component: 'text',
    props: {
      label: 'Name',
      required: true
    }
  },
  'user_type': {
    component: 'select',
    props: {
      label: 'User Type',
      options: () => new Promise(resolve => {
        fetch('<rest api endpoint>')
          .then(res => res.json())
          .then(json => resolve(json.map(r => ({label: r.type, value: r.id}))
          .catch(resolve([]);
      })
    }
  }
}

// assume that the endpoint API returns something like: 
// { result: {user_id: 321, user_type: 123, user_name: 'Foo'} }
const fetchRemoteData = user => new Promise(resolve => {
  fetch(`<url endpoint>/${user}`)
    .then(res => res.json())
    .then(json => resolve({data: json.result}))
    .catch(() => resolve({}))
});

class MyClass extends Component {
  render() {
    return (
      <JsonForm 
        components={formFields}
        fetchData={fetchRemoteData}
        fetchParams={[321,]}
        onSave={(data) => console.log(data)}
        formChange={(data) => console.log(data)}
      />
    )
  }
}
```

## Split form into columns

![Splited columns](./example/public/assets/images/split_columns.png)
```jsx
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
      label: 'Password',
      required: true,
      type: 'password'
    }
  }   
}]
```

## Custom components
```jsx

const MyComponent = ({...props}) => {
  const {id,value,onChange} = props;

  const _increment = () => {
    if(typeof onChange === 'function'){
      onChange({target: {name: id, value: value + 1}})
    }
  }

  return (
    <Button onClick={_increment}>Increment {value}</Button>
  )
}

const formFields = {
  'my_component': {
    component: MyComponent,
    props: { value: 1 }
  },
}
```

## Elements

* Text input
> props required: label
```jsx
'phone_number': {
  component: 'text',
  props: {
    label: 'Phone',
    required: true,
    value: "(123) 456 7899",
    validation: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
    onKeyPress: (ev) => {  }
  }
}
```

* Input Select
> props required: label and options
```jsx
// fixed values
'user_level': {
  component: 'select',
  props: {
    label: 'User Level',
    required: true,
    options: [
      {value: 1, label: 'Admin'},
      {value: 2, label: 'Default'},
    ]
  }
}
```
```jsx
// fetch remote data options
// assume that the endpoint API returns something like: [{id: 123, label: 'Foo'},...]
'user_status': {
  component: 'select',
  props: {
    label: 'User Status',
    options: () => new Promise(resolve => {
      fetch('<rest api endpoint>')
        .then(res => res.json())
        .then(json => resolve(json.map(r => ({label: r.label, value: r.id}))
        .catch(resolve([]);
    })
  }
}
```
* Multiselect
> props required: label and options
```jsx
// fixed values
'user_rights': {
  component: 'multiselect',
  props: {
    label: 'User Rights',
    required: true,
    options: [
      {value: 1, label: 'delete'},
      {value: 2, label: 'update'},
      {value: 3, label: 'insert'},
    ]
  }
}
```
```jsx
// fetch remote data options
'user_rights': {
  component: 'multiselect',
  props: {
    label: 'User Rights',
    options: () => new Promise(resolve => {
      fetch('<rest api endpoint>')
        .then(res => res.json())
        .then(json => resolve(json.map(r => ({label: r.label, value: r.id}))
        .catch(resolve([]);
    })
  }
}
```
* Radio Group
```jsx
'user_gender': {
  component: 'radiogroup',
  props: {
    label: 'User Gender',
    value: 'male'
    options: [
      {value: 'male',   label: 'Male'},
      {value: 'female', label: 'Female'},
      {value: 'unknow', label: 'Unknow'}
    ]
  }
}
// fetch remote data options
'user_gender': {
  component: 'radiogroup',
  props: {
    label: 'User Gender',
    value: 'male'
    options: () => new Promise(resolve => {
      fetch('<rest api endpoint>')
        .then(res => res.json())
        .then(json => resolve(json.map(r => ({label: r.label, value: r.id}))
        .catch(resolve([]);
    })
  }
}
```

* Switch
> props required: label
```jsx
  'user_is_master': {
    component: 'switch',
    props: {
      label: 'Master user',
      value: true,
      value_type: 'bool'
    }
  }
```
* File upload
> props required: label
```jsx
  'file_upload': {
    component: 'upload',
    props: {
      label: 'File Upload',
      info: 'CSV or XML file'
    }
  }
```

## Options

### Control Buttons
```jsx
<JsonForm 
  components={formFields} 
  controlOptions={{
    saveText: 'Save Form',
    cancelText: 'Cancel',
    boxProps: {
      textAlign: 'right'
    }
    confirmSave: 'Confirm form submission?',
    confirmCancel: 'Do you really want to cancel?',
    confirmButtonsLabel: {
      yes: 'Sim', no: 'Não'
    }    
  }}
  onSave={(data) => console.log(data)}
/>
```
- **saveText:** Text for the save button. Default: 'Save'
- **cancelText:** Text for the cancel button. Default: 'Cancel'
- **boxProps:** Options for panel with buttons. Default: null
- **confirmSave:** Adds the confirm alert for the save button. String with the text of the question. Default: null
- **confirmCancel:** Adds the confirm alert for the cancel button. String with the text of the question. Default: null
- **confirmButtonsLabel:** Text for "yes" and "no" dialog buttons. Default: {no: 'No', yes: 'Yes'}

### Skip a property in the model
```jsx
const formFields = {
  'name': {
    component: 'text',
    props: {
      label: 'Name',
      required: true
    }
  },
  'email': {
    component: 'text',
    props: {
      label: 'Email',
      required: true
    }    
  },
  'info': {
    component: 'info',
    props: {
      text: 'Tip: Use a non commercial email.'
    },
    options: {
      skipFromModel: true
    }    
  }  
}
```
### Field dependency
* For select/multiselect/radiogroup
```jsx
const formFields = {
  'user_has_domain': {
    component: 'switch',
    props: {
      label: 'Use domain',
    }
  },
  // without rule
  'user_domain': {
    component: 'select',
    props: {
      label: 'Type',
      options: [...]
    },
    options: {
      depends: 'user_has_domain'
    }
  },
  // with rule. E.g: disabled if selected 'user_domain' value is 2.
  // suported conditions: eq|ne|gt|lt|le|ge
  'user_type': {
    component: 'select',
    props: {
      label: 'Type',
      options: [...]
    },
    options: {
      depends: {
        rules: [
          {field: 'user_domain', condition: 'eq', value: 2}
        ]
      }
    }    
  },  
}
```
* For input text
```jsx
const formFields = {
  'user_password': {
    component: 'text',
    props: {
      label: 'Password',
      type: 'password'
    },
  },
  // with rule length for input text
  // suported conditions: eq|ne|gt|lt|le|ge
  'user_repassword': {
    component: 'text',
    props: {
      label: 'Confirm password',
      type: 'password'
    },
    options: {
      depends: {
        rules: [
          {field: 'user_password', condition: 'ge', length: 6}
        ]
      }
    }
  },
  // with regex. Disable If the regex result exists 
  'user_repassword': {
    component: 'text',
    props: {
      label: 'Confirm password',
      type: 'password'
    },
    options: {
      depends: {
        rules: [
          {field: 'user_password', regex: /abc/g}
        ]
      }
    }
  }  
}
```

### Popule with a model
```jsx
const MyModel = {
  user_name: 'Tom',
  user_email: 'tom@email.com',
  user_gener: 'male'
}

<JsonForm 
  components={formFields} 
  model={MyModel}
  onSave={(data) => console.log(data)}
/>
```

## License

MIT © [Aderbal Nunes](https://github.com/aderbas)
