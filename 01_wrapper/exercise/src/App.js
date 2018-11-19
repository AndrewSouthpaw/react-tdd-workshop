import React from 'react'

export class App extends React.Component {
  static defaultProps = {
    avatar: 'http://www.placecage.com/c/300/300',
    name: 'Nick Cage',
    followers: 42,
  }

  state = {
    isFollowing: false,
  }

  toggleFollow = () => {
    const { isFollowing } = this.state
    this.setState({ isFollowing: !isFollowing })
  }

  render() {
    const { avatar, name } = this.props
    const { isFollowing } = this.state
    return (
      <div className="App">
        <img src={avatar} className="avatar" alt="profile" />
        <h1 className="username">{name}</h1>
        <p className="followers">Followers: {this.props.followers + (isFollowing ? 1 : 0)}</p>
        <button className="follow-btn" onClick={this.toggleFollow} data-test-id="follow-btn">
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      </div>
    )
  }
}
