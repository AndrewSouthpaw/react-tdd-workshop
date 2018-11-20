import React from 'react'
import { mount } from 'enzyme'
import axios from 'axios'
import { curry } from 'ramda'
import sinon from 'sinon'

/**
 * Allows you to select a node by its `data-test-id` attribute. Example usage:
 *
 *    const myButton = sel('my-button', w)
 *
 * It is curried so you can create a higher order named selector for convenience:
 *
 *    const myButton = sel('my-button')
 *    expect(myButton(w).text()).toEqual('I am a button')
 *    myButton(w).simulate('click')
 *    // ... etc.
 */
export const sel = curry((dataTestId, wrapper) => wrapper.find(`[data-test-id="${dataTestId}"]`))

/**
 * Convenience function. Takes a cb which contains setup for the sandbox, and does the appropriate setup
 * for the beforeEach and afterEach blocks.
 */
export const setupSandbox = (cb) => {
  global.sandbox = sinon.createSandbox()

  beforeEach(() => {
    // always stub the server just in case
    serverReturnsSuccess()
    if (cb) cb(global.sandbox)
  })

  afterEach(() => {
    global.sandbox.restore()
  })
}

const serverReturns = (promise) => {
  if (axios.get.restore) {
    axios.get.restore()
    axios.post.restore()
    axios.put.restore()
    axios.delete.restore()
  }

  global.sandbox.stub(axios, 'get').returns(promise)
  global.sandbox.stub(axios, 'post').returns(promise)
  global.sandbox.stub(axios, 'put').returns(promise)
  global.sandbox.stub(axios, 'delete').returns(promise)
}

/**
 * Helper functions to set up a mock server response. Returns the object passed in so you can store it
 * inline and write expectations about it.
 */
export const serverReturnsSuccess = (data) => { // eslint-disable-line arrow-parens
  serverReturns(Promise.resolve({ data }))
  return data
}

export const serverReturnsFailure = (data) => { // eslint-disable-line arrow-parens
  serverReturns(Promise.reject({ response: { data } }))
  return data
}

export const serverReturnsNetworkError = () => {
  serverReturns(Promise.reject({ message: 'Network Error' }))
}

export const resetApiHistory = () => {
  axios.get.resetHistory()
  axios.post.resetHistory()
  axios.put.resetHistory()
  axios.delete.resetHistory()
}

/**
 * From: https://github.com/facebook/jest/issues/2157#issuecomment-279171856
 */
export const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0))

/**
 * Convenience wrapper to mount a component.
 */
export const setupMount = (Component, defaultProps) => (props = {}) => (
  mount(<Component {...defaultProps()} {...props} />)
)

/**
 * Simulates a change event like those triggered by input DOM elements
 */
export const simulateChange = (wrapper, value) => (
  wrapper.simulate('change', { target: { value } })
)

/**
 * Workaround for broken `findWhere` behavior for mounted components when searching by text
 * https://github.com/airbnb/enzyme/issues/1566
 */
const textContent = (node) => {
  try {
    // enzyme sometimes blows up on text()
    return node.text()
  } catch (_e) {
    return ''
  }
}

// useful for finding a node by its text
export const findByText = (text, wrapper, options = {}) => {
  const comparator = options.exact ? x => textContent(x) === text : x => new RegExp(text).test(textContent(x))
  return wrapper.findWhere(comparator).last()
}
