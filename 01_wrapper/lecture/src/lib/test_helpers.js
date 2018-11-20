import React from 'react'
import { mount } from 'enzyme'
import { curry } from 'ramda'

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
 * Convenience wrapper to mount a component.
 */
export const setupMount = (Component, defaultProps) => (props = {}) => (
  mount(<Component {...defaultProps()} {...props} />)
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
