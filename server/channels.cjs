/* eslint-disable no-undef */
module.exports = {
  initializeChannel: name => {
    const channel = {
      name,
      messages: [],
    }

    return channel
  },
}
