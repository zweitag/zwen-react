# Component ([React Docs](https://reactjs.org/docs/react-component.html))

As explained in the [introduction](introduction.md) our goal for the application state is to have a single source of truth. That means that we should avoid using component state wherever possible. While this will possibly lead to a large amount of reducers it also means that components can be focused around what's actually important: the UI.

By using `react-redux` bindings we are able to connect the store to the component with two simple functions.
```
=> components/myFeature/MyComponent.js
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '@/actions/creators';
import * as selectors from '@/selectors';

const mapStateToProps = state => ({
  isMenuOpen: selectors.getIsMenuOpen(state),
});

const mapDispatchToProps = dispatch => ({
  onOpen: dispatch(actions.openMenu()),
});

const MyComponent = ({ isMenuOpen, onOpen }) => (

// ...

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);
```
By defining the used state and methods at the top of the file it'll be easy to see what the component is doing, without having to scroll through all the markup. While some recommend the creation of connected and presentational components, we're not doing this distinction. When you try to keep your components as small and focused as possible, it also makes sense to connect them to gather exactly the information you need.

The component itself is written in typical JSX:
```
// => components/myFeature/MyComponent.js
// ...

const MyComponent = ({ isMenuOpen, onOpen }) => (
  <div>
    {isMenuOpen
      ? <Menu />
      : <Button onClick={onOpen} />
    }
  </div>
);

MyComponent.propTypes = {
  isMenuOpen: PropTypes.bool,
  onOpen: PropTypes.func,
};

MyComponent.defaultProps = {
  isMenuOpen: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);
```
Sometimes a component needs to have access to certain lifecycle methods. In this case it's signature looks like this:
```
// => components/myFeature/MyOtherComponent.js

// ...

class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    // ...
  }

  // ...

  render() {
    const  {
      isFeatureActive,
      activateFeature,
    } = this.props;

    return (
      <div>
        // ...
      </div>
    );
  }
}
// ...
```
