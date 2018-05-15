const should = require("should")
const Slack = require("../lib/slack")
const nock = require("nock")
const _ = require("lodash")

describe("Initialize", () => {
  it("Should requires incomingUrl", () => {
    try {
      const slack = new Slack()
    } catch (e) {
      e.message.should.eql("Incoming url required")
    }
  })

  it("Should not raise error with valid arguments", () => {
    try {
      const slack = new Slack("https://incomingUrl/")
    } catch (e) {
      e.message.should.be.empty
    }
  })
})

describe("Send message", () => {
  describe("String arguments", () => {
    const slack = new Slack("https://incomingUrl/")

    it("Should requires message", () => {
      try {
        slack.notify()
      } catch (e) {
        e.message.should.eql("Message required")
      }
    })

    it("Should sends notification to #general channel, when channel is not specified", done => {
      const expectBody = {
        text: "Message",
        channel: "#general"
      }

      nock("https://incomingUrl")
        .post("/", expectBody)
        .reply(200, "ok")

      slack.notify("Message", (err, result) => {
        should(err).empty
        result.should.eql("ok")
        done()
      })
    })

    it("Should send with defaults options", done => {
      const options = {
        channel: "#development",
        username: "mybot",
        icon_url: "http://mydomain.com/myimage.png",
        icon_emoji: ":shipit:"
      }
      const _slack = new Slack("https://incomingUrl/", options)
      const expectBody = _.clone(options)
      expectBody.text = "Message"

      nock("https://incomingUrl")
        .post("/", expectBody)
        .reply(200, "ok")

      _slack.notify(expectBody.text, (err, result) => {
        should(err).empty
        result.should.eql("ok")
        done()
      })
    })
  })

  describe("Object arguments", () => {
    const slack = new Slack("https://incomingUrl/")

    it("Should sends notification to channel", done => {
      const messages = {
        text: "Message"
      }
      const expectBody = {
        text: messages.text,
        channel: "#general"
      }
      nock("https://incomingUrl")
        .post("/", expectBody)
        .reply(200, "ok")

      slack.notify(messages, (err, result) => {
        should(err).empty
        result.should.eql("ok")
        done()
      })
    })

    it("Should send with defaults options", done => {
      const options = {
        channel: "#development",
        username: "mybot",
        icon_url: "http://mydomain.com/myimage.png",
        icon_emoji: ":shipit:"
      }
      const message = {
        text: "Message",
        channel: "specified"
      }
      const _slack = new Slack("https://incomingUrl/", options)
      let expectBody = _.clone(options)
      expectBody = _.merge(expectBody, message)
      nock("https://incomingUrl")
        .post("/", expectBody)
        .reply(200, "ok")

      _slack.notify(message, (err, result) => {
        should(err).empty
        result.should.eql("ok")
        done()
      })
    })

    it("Should sends notification to specified channel", done => {
      const messages = {
        text: "Message",
        channel: "#channel"
      }
      nock("https://incomingUrl")
        .post("/", messages)
        .reply(200, "ok")

      slack.notify(messages, function(err, result) {
        should(err).empty
        result.should.eql("ok")
        done()
      })
    })

    it("Should sends notification to multiple channel", done => {
      const messages = {
        text: "Message multiple",
        channel: ["#channel1", "#channel2"]
      }
      const expectBody = {
        text: messages.text,
        channel: "#channel1"
      }
      nock("https://incomingUrl")
        .post("/", expectBody)
        .reply(200, "ok")
      const expectBody2 = {
        text: messages.text,
        channel: "#channel2"
      }
      nock("https://incomingUrl")
        .post("/", expectBody2)
        .reply(200, "ok")
      slack.notify(messages, (err, result) => {
        should(err).empty
        result.should.eql("ok")
        done()
      })
    })

    it("Should sends notification when icon_emoji is set", function(done) {
      const messages = {
        text: "Message",
        channel: "channel",
        icon_emoji: "foobar"
      }
      nock("https://incomingUrl")
        .post("/", messages)
        .reply(200, "ok")
      slack.notify(messages, (err, result) => {
        should(err).empty
        result.should.eql("ok")
        done()
      })
    })

    it("Should sends notification when icon_url is set", done => {
      const messages = {
        text: "Message",
        channel: "channel",
        icon_url: "foobar"
      }
      nock("https://incomingUrl")
        .post("/", messages)
        .reply(200, "ok")
      slack.notify(messages, (err, result) => {
        should(err).empty
        result.should.eql("ok")
        done()
      })
    })

    it("Should sends notification when attachments is set", done => {
      const messages = {
        text: "Message",
        channel: "#random",
        attachments: [
          {
            fallback: "Required text summary",
            text: "Optional text",
            pretetxt: "optional pretext",
            color: "warning",
            fields: [
              {
                title: "title1",
                value: "value1",
                short: "short"
              }
            ]
          }
        ]
      }
      nock("https://incomingUrl")
        .post("/", messages)
        .reply(200, "ok")
      slack.notify(messages, (err, result) => {
        should(err).empty
        result.should.eql("ok")
        done()
      })
    })
  })
})
