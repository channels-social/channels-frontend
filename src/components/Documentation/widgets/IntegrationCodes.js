export const reactCode = `
<button className="launch-button" onClick={openChannels}>
  Open Channels
</button>

const openChannels = () => {
  setTimeout(() => {
    if (window.openChannelsWidget) {
      window.openChannelsWidget({
        selectedChannel: "channel2",
        email: "user@example.com",
        selectedTopic: "topic4",
        channels: ["channel1", "channel2"],
      });
    } else {
      console.warn("openChannelsWidget not ready");
    }
  }, 200);
};

// Place this iframe anywhere in your JSX code where you want to integrate channels.
<iframe
  src="https://channels.social/embed/channels"
  title="Channels Embed"
  className="channels-frame"
/>
`;

export const vueCode = `
<template>
  <button @click="openChannels">Open Channels</button>
  <iframe
    src="https://channels.social/embed/channels"
    title="Channels Embed"
    class="channels-frame"
  ></iframe>
</template>

<script>
export default {
  methods: {
    openChannels() {
      setTimeout(() => {
        if (window.openChannelsWidget) {
          window.openChannelsWidget({
            selectedChannel: "channel2",
            email: "user@example.com",
            selectedTopic: "topic4",
            channels: ["channel1", "channel2"],
          });
        }
      }, 200);
    },
  },
};
</script>
`;

export const nextjsCode = `
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://channels.social/widget.js?apiKey=your-api-key";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const openChannels = () => {
    setTimeout(() => {
      if (window.openChannelsWidget) {
        window.openChannelsWidget({
          selectedChannel: "channel2",
          email: "your@email.com",
          selectedTopic: "topic4",
          channels: ["channel1", "channel2"],
        });
      }
    }, 200);
  };

  return (
    <>
      <button onClick={openChannels}>Open Channels</button>
      <iframe src="https://channels.social/embed/channels" title="Channels" className="channels-frame" />
    </>
  );
}
`;

export const flutterCode = `
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class ChannelsEmbed extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return WebView(
      initialUrl: 'https://channels.social/embed/channels',
      javascriptMode: JavascriptMode.unrestricted,
    );
  }
}
`;

export const phpCode = `
<!-- Trigger Button -->
<button onclick="openChannels()">Open Channels</button>

<script>
  function openChannels() {
    setTimeout(() => {
      if (window.openChannelsWidget) {
        window.openChannelsWidget({
          selectedChannel: "channel2",
          email: "your@email.com",
          selectedTopic: "topic4",
          channels: ["channel1", "channel2"]
        });
      }
    }, 200);
  }
</script>

<!-- Embed iframe anywhere -->
<iframe
  src="https://channels.social/embed/channels"
  title="Channels Embed"
  class="channels-frame"
></iframe>
`;
export const htmlJsCode = `
<!-- Trigger Button -->
<button onclick="openChannels()">Open Channels</button>

<script>
  function openChannels() {
    setTimeout(() => {
      if (window.openChannelsWidget) {
        window.openChannelsWidget({
          channels: ["Channel1", "Channel2"],
          selectedChannel: "Channel1",
          selectedTopic: "Topic4",
          email: "user@example.com",
          autoLogin: true
        });
      } else {
        console.warn("openChannelsWidget not ready");
      }
    }, 200);
  }
</script>

<!-- Embed iframe -->
<iframe
  src="https://channels.social/embed/channels"
  title="Channels Embed"
  class="channels-frame"
></iframe>
`;
export const angularCode = `
<!-- component.html -->
<button (click)="openChannels()">Open Channels</button>

<iframe
  src="https://channels.social/embed/channels"
  title="Channels Embed"
  class="channels-frame"
></iframe>
`;

export const angularTsCode = `
// component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-channels-widget',
  templateUrl: './channels-widget.component.html'
})
export class ChannelsWidgetComponent implements OnInit {
  ngOnInit() {
    const script = document.createElement('script');
    script.src = 'https://channels.social/widget.js?apiKey=your-api-key';
    script.async = true;
    document.body.appendChild(script);
  }

  openChannels() {
    setTimeout(() => {
      if (window.openChannelsWidget) {
        window.openChannelsWidget({
          channels: ['Channel1', 'Channel2'],
          selectedChannel: 'Channel1',
          selectedTopic: 'Topic4',
          email: 'user@example.com',
          autoLogin: true
        });
      }
    }, 200);
  }
}
`;
