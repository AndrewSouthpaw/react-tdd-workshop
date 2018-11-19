import React from 'react'
import { mount } from 'enzyme'
import { App } from './App'
import { findByText, sel, simulateChange } from './lib/test_helpers'

describe('App', () => {
  const followBtn = sel('follow-btn')
  const sendMessageBtn = sel('send-message-btn')
  const messageField = sel('message-field')

  it('clicking the Follow button increments the number of followers and changes button text to "Unfollow"', () => {
    const w = mount(<App followers={42} />)
    expect(findByText('Followers:', w).text()).toEqual('Followers: 42')
    expect(followBtn(w).text()).toEqual('Follow')
    followBtn(w).simulate('click')
    expect(findByText('Followers:', w).text()).toEqual('Followers: 43')
    expect(followBtn(w).text()).toEqual('Unfollow')
  })

  it('clicking the "Unfollow" button decrements the number of followers and changes button text to "Follow"', () => {
    const w = mount(<App followers={42} />)

    // setup, start with us following them
    followBtn(w).simulate('click')

    expect(findByText('Followers:', w).text()).toEqual('Followers: 43')
    followBtn(w).simulate('click')
    expect(findByText('Followers:', w).text()).toEqual('Followers: 42')
    expect(followBtn(w).text()).toEqual('Follow')
  })

  it('should foo', () => {
    const w = mount(<App />)
    sendMessageBtn(w).simulate('click')
  })

  it('sending a message', () => {
    const w = mount(<App />)

    { // send message button is initially disabled
      expect(sendMessageBtn(w).props().disabled).toEqual(true)
    }

    { // typing in a message removes disabled functionality
      simulateChange(messageField(w), 'Test message')
      expect(sendMessageBtn(w).props().disabled).toEqual(false)
    }

    { // clicking to send message displays a confirmation
      sendMessageBtn(w).simulate('submit')
      expect(w.text()).toMatch('You sent a message: Test message')
    }
  })
})
