# jsonform

> Create material design form from a JSON

[![NPM](https://img.shields.io/npm/v/jsonform.svg)](https://www.npmjs.com/package/jsonform) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save jsonform
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
## Popule with remote data

```jsx
const formFields = {
  'name': {
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
        fetch('<url endpoint>')
          .then(res => res.json())
          .then(json => resolve(json.result.map(r => ({label: r.type, value: r.id}))
          .catch(resolve([]);
      })
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


## License

MIT © [Aderbal Nunes](https://github.com/aderbas)
