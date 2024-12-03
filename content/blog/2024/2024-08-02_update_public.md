---
title: 11ty Beta and Going Public
description: A new middle
date: 2024-08-02
tags: ['github', 'design', '11ty']
---
So it's August. I'm coming out of my illness, which is good. I've been working remotely and mostly staying indoors so this has given me time to keep myself from losing my mind and updating the site.

I updated to the [11ty 3.0.0-beta](https://www.11ty.dev/blog/three-point-oh-beta-one/). I was already running the alpha versions, so that was as quick as an update.

Additionally, I've been working extensively on updating the site to make the design points consistent across the pages. I realized I had different design ideas throughout that were at times conflicting or completely different from other pages. Hopefully I've caught most of those, but if you see something, let me know.

The one big thing I did was make my [Github](https://github.com) repo public. It was private since inception as I worked through the site, design, etc. After over 450 commits, I did some work to merge and move repos to start fresh on the commits. This wasn't (purely) hubris. I had realized about the midpoint of commits that I had accidentally committed my `.env` file. I wanted to erase the history of those commits as well. It only houses my webmentions API token, which I also changed to be extra safe, but I wanted a fairly clean start as well.

I was running into errors deploying the builds after adding `.env` to `.gitignore`. That was the last hurdle prior to cleaning up the commit history before taking it public. It was fixed after a quick stop at the [11ty Discord Channel](https://discord.com/channels/741017160297611315/1022195881698672650). I added the `env` line to my `deploy-neocities.yml` file, which, FYI, if you switch to Neocities, [this is a great way to deploy to it](https://deadrodrick.neocities.org/tutorial/deploy-to-neocities).

```yml 
name: Deploy to neocities
on:
  schedule:
  - cron: '0 */4 * * *'

# only run on changes to master
  push:
    branches:
      - main

concurrency: # prevent concurrent deploys doing strange things
  group: deploy-to-neocities
  cancel-in-progress: true
  
env:
  WEBMENTION_IO_TOKEN: ${{ secrets.WEBMENTION_IO_TOKEN }}

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    # Set up any tools and build steps here
    # This example uses a Node.js toolchain to build a site
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: lts/*
    - name: Install deps and build
      run: |
        npm i
        npm run build
    # When the dist_dir is ready, deploy it to neocities
    - name: Deploy to neocities
      uses: bcomnes/deploy-to-neocities@v1
      with:
        api_token: ${{ secrets.NEOCITIES_TOKEN }}
        cleanup: true
        dist_dir: _site
```


So there it is. The site's humming along, the repo's public, and I'm on the mend. Not a bad way to walk gingerly into the weekend.