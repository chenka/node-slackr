Summary
=======
A simple node.js library for send notifications to [Slack](https://slack.com/) via Incoming WebHooks.


Installation
=======
You can also install via npm:
```sh
npm install node-slackr
```

Initialize client:

```
Slack = require('node-slackr');
slack = new Slack('team','token');
```

###Send message:

If channel is not set default channel is *#general*
```
slack.notify("Message"); //without callback
slack.notify("Message", function(err, result){
    console.log(err,result);
});

```

###Customized Appearance:

You can customize the name and icon of your Incoming Webhook.

```
messages = {
    text: "Message",
    channel: "#random",
    username: "new-bot-name",
    icon_url: "https://slack.com/img/icons/app-57.png"
}
    
slack.notify(messages);
```

Send multiple channels:
```
messages = {
    text: "Message",
    channel: ["#channel1","#channel2","#channel3]
}
    
slack.notify(messages);
```


###Message Attachments:
To display a richly-formatted message attachment in Slack, you can use the same JSON payload as above, but add in an attachments array. Each element of this array is a hash containing the following parameters:

```
messages = {
  text: "Message",
  channel: "#random",
  attachments: [
    {
      fallback: "Required text summary of the attachment that is shown by clients that understand attachments but choose not to show them.",
      "text": "Optional text that should appear within the attachment",
      "pretext": "Optional text that should appear above the formatted data",
      "color": "#36a64f", // Can either be one of 'good', 'warning', 'danger', or any hex color code
      //fields is optional
      fields: [
        {
          title: "Required Field Title",
         value: "Text value of the field. May contain standard message markup and must be escaped as normal. May be multi-line.",
          short: false // Optional flag indicating whether the `value` is short enough to be displayed side-by-side with other values
        }
      ]
    }
  ]
};

slack.notify(messages, function(err, result) {
    console.log(err, result);
});

```

###Documentation

For more information such as send URL link, Message Formatting, @mention and Parsing modes,  please follow the link below

[Formatting](https://api.slack.com/docs/formatting)

[Incomg Webook](https://my.slack.com/services/new/incoming-webhook)


