---
title: Webmentions and 11ty
description: Getting webmentions up and running on 11ty - update!
date: 2024-06-19
tags: ['11ty', 'webmentions']
---

> [!NOTE]
> 08/02/2024
> I updated the code in this post to show the changes with Eleventy 3.0.0 & my simplified `eleventy.config.js`
> Additionally, added a cleaned up `webmentions.js` example.

I have been struggling getting webmentions working on the site. It's worth noting that I don't have many yet, but I like to think I'm preparing for the future.

I found [Bob Monsour's blog post](https://www.bobmonsour.com/posts/adding-webmentions-to-my-site/) on the topic the most helpful. While your mileage may vary, I found a couple of changes helped with my flow. It's worth noting, my JS skills are not the strongest, so troubleshooting some of the issues was perhaps more difficult for me than they may be for you.

First, my `_data/webmentions.js` looks like this:

```js
import EleventyFetch from "@11ty/eleventy-fetch";
import 'dotenv/config';

export default async function () {
  const WEBMENTIONS_STUFF = process.env.WEBMENTION_IO_TOKEN;
  const url = `https://webmention.io/api/mentions.jf2?token=${WEBMENTIONS_STUFF}&per-page=900`;
  const res = await EleventyFetch(url, {
    duration: "1h",
    type: "json",
  });
  const webmentions = res;
  return {
    mentions: webmentions.children,
  };
}
```
This adds the `import 'dotenv/config';` to it. If you already trigger that elsewhere, disregard this adjustment.

Additionally, don't forget to add these to your eleventy.js (or eleventy.config.js) file.
```js
eleventyConfig.addFilter("webmentionsByUrl", webmentionsByUrl);
eleventyConfig.addFilter("plainDate", plainDate);
```

Since I no longer have a `./config/filters/index.js` I added the filters directly to my `eleventy.config.js` file:

```js
export const webmentionsByUrl = (webmentions, url) => {
  const allowedTypes = {
    likes: ["like-of"],
    reposts: ["repost-of"],
    comments: ["mention-of", "in-reply-to"],
  };

  const sanitize = (entry) => {
    if (entry.content && entry.content.html) {
      entry.content = sanitizeHTML(entry.content.html, {
        allowedTags: ["b", "i", "em", "strong", "a"],
      });
    }
    return entry;
  };

  const pageWebmentions = webmentions
    .filter(
      (mention) => mention["wm-target"] === "https://stuffandthings.lol" + url
    )
    .sort((a, b) => new Date(b.published) - new Date(a.published))
    .map(sanitize);

  const likes = pageWebmentions
    .filter((mention) => allowedTypes.likes.includes(mention["wm-property"]))
    .filter((like) => like.author)
    .map((like) => like.author);

  const reposts = pageWebmentions
    .filter((mention) => allowedTypes.reposts.includes(mention["wm-property"]))
    .filter((repost) => repost.author)
    .map((repost) => repost.author);

  const comments = pageWebmentions
    .filter((mention) => allowedTypes.comments.includes(mention["wm-property"]))
    .filter((comment) => {
      const { author, published, content } = comment;
      return author && author.name && published && content;
    });

  const mentionCount = likes.length + reposts.length + comments.length;
  const data = { likes, reposts, comments, mentionCount };
  return data;
};

export const plainDate = (isoDate) => {
  let date = new Date(isoDate);
  let options = { year: "numeric", month: "long", day: "numeric" };
  let formattedDate = date.toLocaleDateString("en-US", options);
  return formattedDate;
};
```

With those, I was able to get webmentions working. You'll see them in action on [this post](https://stuffandthings.lol/2024-06-09_site_updates/) and others. I'll note that I did remove the Comments section of the webmentions. I know there's debate on the privacy on webmentions and (as of right now) think this a good compromise.
