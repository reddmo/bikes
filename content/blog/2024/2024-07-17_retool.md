---
title: A Little Clean-up
description: A few design tweaks and an RSS feed fix
date: 2024-07-17
tags: ['rss', 'design']
---
I've spent some time doing a little tidying on the site to make it a little cleaner overall. I've honed some colors and added texture to the cards, buttons, and webmention images. This was all just to give it a little more polish. I like it. For now.

One of the other issues I had been running into was the RSS feed not generating properly and, thusly, not pushing to EchoFeed correctly (if at all). After wandering through the wilderness trying to fix it, I hopped onto the 11ty Discord server, popped into the Help channel and had an fix in just a few minutes. 

I don't think it's the easiest fix and perhaps someone with better skills than me would've come up with a nicer one, but it works. 

I'm using the [11ty RSS plugin](https://www.11ty.dev/docs/plugins/rss/) on the canary builds. With the way it generates the feed and the way my posts generated to the site, something was pushing them to the RSS feed with earliest posts first (and reposting). So, I added this to my `eleventy.config.js` file:

```js    
eleventyConfig.addCollection("articles", function (collectionsApi) {
    return collectionsApi.getFilteredByGlob("src/posts/*.md");
  });
```

And then just added that collection:

```js  
eleventyConfig.addPlugin(feedPlugin, {
	type: "atom",
	outputPath: "feed.xml",
	collection: {
		name: "articles",
		limit: 0,
	}
```

I still have a "posts" collection that correctly adds the posts to the site itself in the proper order:

```js
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md").reverse();
  });
```

The new collection just reverses that one for the RSS feed. I built this site up from a starter template, so I haven't quite dug into why the original "posts" collection needs to be reversed. So, again, there may be a simpler way out there and I'm still (semi-)actively working on it but for now everything's working as it should be. But I'm also learning some of this as I fix it, break it, and modify it.

Anyway, here's an album for you: [Charm](https://open.spotify.com/album/1KNUCVXgIxKUGiuEB8eG0i?si=UfDOw74LTVuk6CnkVe-3gQ) by Clairo.
