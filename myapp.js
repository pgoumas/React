'use strict';

var RandomMessage = React.createClass({
  displayName: 'RandomMessage',

  getInitialState: function getInitialState() {
    return { message: 'Hello, Universe' };
  },
  onClick: function onClick() {
    var messages = ['Hello, World', 'Hello, Planet', 'Hello, Universe'];
    var randomMessage = messages[Math.floor(Math.random() * 3)];

    this.setState({ message: randomMessage });
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(MessageView, { message: this.state.message }),
      React.createElement(
        'p',
        null,
        React.createElement('input', { type: 'button', onClick: this.onClick, value: 'Change Message' })
      )
    );
  }
});

var MessageView = React.createClass({
  displayName: 'MessageView',

  render: function render() {
    return React.createElement(
      'p',
      null,
      this.props.message
    );
  }
});

ReactDOM.render(React.createElement(RandomMessage, null), document.getElementById('root'));