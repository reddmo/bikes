---
title: Adding GitHub Style Alerts and Footnotes
description: Some timely posts help get me on track
date: 2024-12-10
draft: false
tags:
 - 11ty
 - markdown-it
---
I had been trying off-and-on for some time to get [GitHub style alerts](https://github.com/antfu/markdown-it-github-alerts) working on the site after reading [Robb Knight's Post](https://rknight.me/blog/adding-githubstyle-markdown-alerts-to-eleventy/) on them but kept getting stuck at different points along the way. After I temporarily moved my site to BearBlog, I returned to 11ty and deploying to Netlify and started tinkering again.

Step in [this excellent post](https://www.bobmonsour.com/posts/going-all-in-with-native-markdown/) by Bob Monsour on using `markdown-it` for his ToC and a few things started to click. And [Thomas Rigby's post](https://thomasrigby.com/posts/adding-github-or-obsidian-callouts-to-an-eleventy-blog-the-easy-way/) specifically on the alerts was invaluable. Now I have the GitHub-style alerts working here.[^1] I just think they look neat and add a little spice to the site.

But this led me to the other markdown-it plugin I wanted to implement: footnotes. I really don't know if I'll use footnotes a lot but implementing them or, more accurately, not quite getting them to work bothered me. After getting the GitHub-style alerts working, I decided to take another crack at the [markdown-it-footnote plugin](https://github.com/markdown-it/markdown-it-footnote) and using the tools from the alerts, had them up and running in just a few minutes.

Again, it's more the journey than knowing what I'm going to do once I get there.

[^1]: You can see them in action on [this post](https://stuffandthings.lol/blog/2024/2024-06-19_webmentions/).