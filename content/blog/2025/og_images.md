---
title: O(M)G Images
description: Getting og:image to work with a plugin and some grit
date: 2025-01-15
draft: false
tags:
 - og-image
 - 11ty
---
This was a tricky one. A few days ago I started working on opengraph images for my website. I hit a snag and after a quick post on the [11ty](https://11ty.dev) Discord channel, it was resolved. I wasn't passing the absolute URL for my site to it and, at the time, I was just using a static image for all posts. 

Fast forward a day and I wanted to automate it. The goal from the beginning was to eventually use the [Eleventy Plugin Og Image](https://github.com/KiwiKilian/eleventy-plugin-og-image). I had read a few posts, including [Robb Knight's](https://rknight.me/blog/generating-and-caching-open-graph-images-with-eleventy/) on the matter and figured I'd spin it up quickly. I wasn't quite yet interested in caching because a lengthier build time isn't a deal-breaker for me at the moment. I can push the changes and let Cloudflare do its thing and move on. (Right now build time is about 10 minutes. I will eventually work on caching this but that's for another day. Maybe today, who knows.)

So it all seemed straightforward. Until it wasn't. I had an image I wanted to use as the basis for the OG image but also include the post title. This was fine. In my `og-image.og.njk` file, I have:

```html
  <div class="root">
    <h1 class="title"><img src="https://stuffandthings.lol/img/stuff2.png" alt="stuff&things"></h1>
    <div class="card">
      <h2 class="sub-title">{{ title }}</h2>
    </div>
  </div>
```

And it works. It's fine. I saw elsewhere that you had to change the `img` from `png`. I haven't run into any issues with this so, until I do, I'm comfortable with what I have. 

The next item was loading the plugin itself. In my `base.njk` file I added this per the plugin instructions, `{% ogImage "./og-image.og.njk", { title: title | safe } %}` (along with some tweaking with the title) and that was that.

Then the headache. 

The plugin instructions, which are very good all the same, gives the base for adding to your `eleventy.config.js` file. So I added:

```js
 eleventyConfig.addPlugin(EleventyPluginOgImage, {
    satoriOptions: {
      fonts: [
        {
          name: 'B612',
          data: fs.readFileSync('content/assets/fonts/B612-Bold.ttf'),
          weight: 700,
          style: 'normal',
        },
      ],
    },
  });
```

And it worked. On the local server. Pushed out to the world-at-large and ... nothing. It wasn't generating an absolute URL. Surely, I thought to myself, this can't be my fault. I looked at the plugin instructions, read Robb's article a few more times, dug through some other repos where I knew it was being used all to no avail. I knew it was something I was doing incorrectly or, more accurately, something I wasn't doing.

Re-reading the plugin instructions after a few hours of working on this off-and-on, I again looked at the list of configuration options and finally saw the `shortcodeOutput` property. I dug through the plugin sample and realized it wasn't set up to pass the absolute URL for the image and this is where it was breaking on build. So, I amended my `eleventy.config.js` file to this:

```js
 eleventyConfig.addPlugin(EleventyPluginOgImage, {
    shortcodeOutput: async (ogImage) => `<meta property="og:image" content="https://stuffandthings.lol${await ogImage.outputUrl()}" />`,
    satoriOptions: {
      fonts: [
        {
          name: 'B612',
          data: fs.readFileSync('content/assets/fonts/B612-Bold.ttf'),
          weight: 700,
          style: 'normal',
        },
      ],
    },
  });
```

And now it's working. The only issue I'm currently running into is that sharing from one of my Mastodon accounts is pulling an old OG image and `metadata.title`. But if I share elsewhere or from another Mastodon account and instance, it's fine. So that's an issue for another day. I'm confident it's Mastodon and cache related but haven't dug too far on that one yet (other than a quick Mastodon post on the matter). 

Anyway, I hope this helps someone out there. My next step is to work on caching the files to diminish the build time. I was working on that simultaneously as the images themselves but since I didn't know what was causing the issues I scrapped that portion of it and went back to basics to generate the images. 