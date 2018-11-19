import React from 'react'
import { mount } from 'enzyme'
import axios from 'axios'
import { assoc, curry, equals, keys, reduce, union } from 'ramda'
import sinon from 'sinon'

let id = 0

export const nextId = () => id++

export const noop = () => {}

/**
 * Passes through the function. Useful for connector functions.
 */
export function passThrough(a) { return a }

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
 * Takes the difference between two objects. Does not accommodate deep diffing.
 */
export const diff = (lhs, rhs) => {
  const ks = union(keys(lhs), keys(rhs))
  return reduce(
    (acc, k) => (equals(lhs[k], rhs[k]) ? acc : assoc(k, rhs[k], acc)),
    {},
    ks,
  )
}

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

export const collect = (...vals) => [vals, ...vals]

export const sleep = async timeInMs => new Promise(res => setTimeout(res, timeInMs))

/**
 * Convenience wrapper to mount a component.
 */
export const setupMount = (Component, defaultProps) => (props = {}) => (
  mount(<Component {...defaultProps()} {...props} />)
)

/**
 * Simulates a click on the Enzyme wrapper and provides along useful stubs for common SyntheticEvent
 * props, e.g. stopPropagation.
 */
export const simulateClick = (wrapper, data) => (
  wrapper.simulate('click', { stopPropagation: sinon.stub(), ...data })
)

/**
 * Simulates a change event like those triggered by input DOM elements
 */
export const simulateChange = (wrapper, value) => (
  wrapper.simulate('change', { target: { value } })
)

/**
 * Simulates a press for react native tests. There is no built-in support for press events, so the system is hacked
 * by simply walking up the tree until a component with an `onPress` property is found. Not the best, but better
 * than nothing.
 */
export const simulatePress = (wrapper, data) => {
  const { onPress } = wrapper.props()
  if (onPress) {
    onPress(data)
  } else {
    try {
      simulatePress(wrapper.parent(), data)
    } catch (e) {
      throw new Error('Could not find any elements with onPress property!')
    }
  }
}

/**
 * Mocks a React component, useful when you're doing `mount` (for refs, lifecycle testing, etc.) and don't want to
 * actually mount some components.
 */
export const mockComponent = (componentName, methods) => (
  createReactClass(({
    displayName: componentName,
    render: () => null,
    ...methods,
  }))
)

/**
 * Helper function
 * @param wrapper
 * @returns {Promise<void>}
 */
export const reflush = async (wrapper) => {
  await flushPromises()
  wrapper.update()
}

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

// get the text of all nodes in the tree
export const textList = (wrapper) => wrapper.map(x => x.text())

// check if any part of the tree contains a class name. Expects 'foo' instead of '.foo'
export const containsClass = (className, wrapper) => {
  if (typeof className === 'string') {
    return wrapper.map(node => node.hasClass(className)).some(x => x) || (
      wrapper.children().exists()
        ? wrapper.children().map(node => containsClass(className, node)).some(x => x)
        : false
    )
  } else {
    const cn = className // flow type refinement
    return wrapper.map(node => cn.test(node.props().className)).some(x => x)
  }
}

// Special data must be passed to Link component to correctly simulate navigation to link. ¯\_(ツ)_/¯
// https://github.com/airbnb/enzyme/issues/516
export const navigateLink = (wrapper, data) => simulateClick(wrapper, { button: 0, ...data })
