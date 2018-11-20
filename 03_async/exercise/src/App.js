import React from 'react'
import axios from 'axios'

export class App extends React.Component {
  static defaultProps = {
    avatar: 'http://www.placecage.com/c/300/300',
    name: 'Nick Cage',
  }

  state = {
    followers: null,
    isFollowing: false,
  }

  componentDidMount() {
    axios.get('http://faker.hook.io/?property=random.number')
      .then((res) => { this.setState({ followers: res.data }) })
  }

  toggleFollow = () => {
    const { isFollowing } = this.state
    this.setState({ isFollowing: !isFollowing, followers: this.state.followers + (isFollowing ? -1 : 1) })
  }

  render() {
    const { avatar, name } = this.props
    const { isFollowing } = this.state
    return (
      <div className="App">
        <img src={avatar} className="avatar" alt="profile" />
        <h1 className="username">{name}</h1>
        <p>
          <span className="followers">Followers: {this.state.followers ? this.state.followers : '(Loading...)'}</span>
          <button className="follow-btn" onClick={this.toggleFollow} data-test-id="follow-btn">
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        </p>
      </div>
    )
  }
}
