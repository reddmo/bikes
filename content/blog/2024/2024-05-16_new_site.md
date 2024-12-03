---
title: Image-ine that
description: Images break my RSS feed
date: 2024-05-16
tags: ['weblogpomo2024', 'rss']
---
Some of you who maybe stop by here somewhat regularly are aware that I recently re-designed the site (again). This time, I used the Nulite starter, found [here](https://github.com/codingpotions/nulite/tree/main) and the sample page [here](https://nulite-starter.netlify.app).

I like the simplicity of it, though may one day go back to the old style or just completely re-design again. What I did like about this starter was it's *mostly* barebones. You can build upon it as much (or as little!) as you like. 

One little thing I've run into is posts with images break the RSS feed. I get an error of a mismatched `<p>` on any line that has an image associated with it from the rss.xml file. I haven't yet figured out what's breaking it. The images are inserted into the post normally - `![Image description](/path/img.png)` - and they show up in the local version and build but, again, the rss feed breaks wherever that post falls in the .xml file. 

I've removed some of those posts for now. I should also note it only seems to impact images embedded in markdown posts. For example, the images in the footer, which are in a .liquid file, do not.

Anyway, that's my lamentation for now. 

A quick note that I'll be out of town the next few days, so I may miss a few posts (maybe Friday and Saturday). I'll hopefully catch up on Sunday.

Here’s a listen for today: [Bridge Over Troubled Water](https://open.spotify.com/track/6DlcCzipvwNj6X7LlvxDGD?si=bc30050128744172) by Elvis Presley.
