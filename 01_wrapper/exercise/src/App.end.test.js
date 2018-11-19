import React from 'react'
import { mount } from 'enzyme'
import { App } from './App'
import { findByText, sel } from './lib/test_helpers'

describe('App', () => {
  it('should show a profile image', () => {
    const w = mount(<App />)
    expect(w.find('img').exists()).toEqual(true)
  })

  it('should show the number of followers based on props', () => {
    const w = mount(<App followers={42} />)
    expect(findByText('Followers:', w).text()).toEqual('Followers: 42')
    w.setProps({ followers: 43 })
    expect(findByText('Followers:', w).text()).toEqual('Followers: 43')
  })

  it('should have a button that says follow', () => {
    const w = mount(<App />)
    expect(sel('follow-btn', w).text()).toEqual('Follow')
  })
})
