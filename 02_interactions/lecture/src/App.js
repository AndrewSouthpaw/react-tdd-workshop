import React from 'react'

export class App extends React.Component {
  static defaultProps = {
    avatar: 'http://www.placecage.com/c/300/300',
    name: 'Nick Cage',
    followers: 42,
  }

  state = {
    isFollowing: false,
    message: '',
    sentMessage: '',
  }

  handleChange = (e) => {
    this.setState({ message: e.target.value, sentMessage: '' })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({ message: '', sentMessage: this.state.message })
  }

  toggleFollow = () => {
    const { isFollowing } = this.state
    this.setState({ isFollowing: !isFollowing })
  }

  render() {
    const { avatar, name } = this.props
    const { isFollowing, message, sentMessage } = this.state
    return (
      <div className="App">
        <img src={avatar} className="avatar" alt="profile" />
        <h1 className="username">{name}</h1>
        <p>
          <span className="followers">Followers: {this.props.followers + (isFollowing ? 1 : 0)}</span>
          <button className="follow-btn" onClick={this.toggleFollow} data-test-id="follow-btn">
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        </p>
        <form onSubmit={this.handleSubmit}>
          <textarea value={message} onChange={this.handleChange} data-test-id="message-field" />
          <div>
            <button type="submit" data-test-id="send-message-btn" disabled={!message}>Send Message</button>
          </div>
        </form>
        {sentMessage && (<p>You sent a message: {sentMessage}</p>)}
      </div>
    )
  }
}
