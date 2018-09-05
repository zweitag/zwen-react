# React Native ([Docs](https://facebook.github.io/react-native/docs/getting-started.html))

… some introduction …

## Styling in React Native

With React Native, you don't use a special language or syntax for defining styles. You just style your application using JavaScript. All of the core components accept a prop named `style`. The style names and values usually match how CSS works on the web, except names are written using camel casing, e.g. `backgroundColor` rather than `background-color`.

// < WIP >

Differences / Specials:

- No style inheritance like in CSS
- Only a subset of CSS is valid (e.g. no `:last-child`)
- Layout: Flexbox to rule them all

// < /WIP >

## How to set styles?

Styles aren’t set component based like in the web with ZASAF. Instead they’re defined in a more reusable DRY approach because you’ll often use the same styles over and over again.

### BAD

The naming of the styles could get really bad, which means they’re harder to read and not so easily picked up.

#### Component 1

```jsx
// Login.js

import styles from './Login.styles';

<View style={styles.login}>
  <LoginHeader />
  <LoginForm />
</View>
```

```jsx
// Login.styles.js

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  login: {
    …
  },
});
```

#### Component 2

```jsx
// LoginHeader.js

import styles from './LoginHeader.styles';

<View style={styles.loginHeader}>
  …
</View>
```

```jsx
// LoginHeader.styles.js

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  loginHeader: {
    …
  },
});
```

#### Component 3

```jsx
// LoginForm.js

import styles from './LoginForm.styles';

<View style={styles.loginForm}>
  <Item style={styles.loginFormItem}>
    <Label style={styles.loginFormFloatingLabel}>
      {label}
    </Label>
    <Input style={styles.loginFormInput} />
  </Item>
</View>
```

```jsx
// LoginForm.styles.js

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  loginForm: {
    …
  },
  loginFormItem: {
    …
  },
  loginFormFloatingLabel: {
    …
  },
  loginFormInput: {
    …
  },
});
```

### GOOD

You can easily read from the `style` prop how your styling might look like. And on top of that, the styles are reusable so your codebase keeps DRY.

#### Components

```jsx
// Login.js

import { containerStyles } from '@/styles/generic';

<View style={containerStyles.stretched}>
  <LoginHeader />
  <LoginForm />
</View>
```

```jsx
// LoginHeader.js

import { headerStyles } from '@/styles/generic';

<View style={headerStyles.container}>
  …
</View>
```

```jsx
// LoginForm.js

import {
  containerStyles,
  formStyles,
} from '@/styles/generic';

<View style={containerStyles.centered}>
  <Item style={formStyles.item}>
    <Label style={formStyles.floatingLabel}>
      {label}
    </Label>
    <Input style={formStyles.input} />
  </Item>
  …
</View>
```

#### Styling

```jsx
// styles > generic > container.js

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  centered: {
    …
  },
  stretched: {
    …
  },
});
```

```jsx
// styles > generic > form.js

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  item: {
    …
  },
  floatingLabel: {
    …
  },
  input: {
    …
  },
});
```

```jsx
// styles > generic > header.js

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    …
  },
});
```
