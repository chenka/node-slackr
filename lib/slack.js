const request = require("request")
const _ = require("lodash")

class Slack {
  constructor(incomingUrl, options) {
    this.incomingUrl = incomingUrl
    this.options = options
    this.validateArguments()
  }
  validateArguments() {
    if (this.incomingUrl == null) {
      throw new Error("Incoming url required")
    }
  }
  notify(message, callback) {
    var chn, count, i, len, ref, results, total
    if (
      message == null ||
      _.isObject(message && (message != null ? message.text : void 0) == null)
    ) {
      throw new Error("Message required")
    }
    let options = {}
    options.text = typeof message === "string" ? message : message.text
    options.channel = message.channel == null ? "#general" : message.channel
    options = _.extend(options, this.options)
    options = _.extend(options, message)
    if (_.isArray(options.channel)) {
      total = options.channel.length
      count = 0
      ref = options.channel
      results = []
      for (i = 0, len = ref.length; i < len; i++) {
        chn = ref[i]
        options.channel = chn
        results.push(
          request.post(
            this.incomingUrl,
            {
              body: JSON.stringify(options)
            },
            function(err, resp, body) {
              count++
              if (callback != null && count === total) {
                if (body === "ok") {
                  return callback(null, body)
                } else {
                  return callback(err || body)
                }
              }
            }
          )
        )
      }
      return results
    } else {
      return request.post(
        this.incomingUrl,
        {
          body: JSON.stringify(options)
        },
        function(err, resp, body) {
          if (callback != null) {
            if (body === "ok") {
              return callback(null, body)
            } else {
              return callback(err || body)
            }
          }
        }
      )
    }
  }
}

module.exports = Slack
