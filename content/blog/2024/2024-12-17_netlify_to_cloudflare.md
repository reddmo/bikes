---
title: Netlify to Cloudflare
description: Moving 11ty site to Cloudflare
date: 2024-12-17
draft: false
tags:
 - 11ty
 - cloudflare
 - netlify
---
I had been contemplating the move to Cloudflare from Netlify for a host of reasons; their approach to keeping AI bots, etc., from your site was one of them. Then I got an email from Netlify telling me I had reached 50% of usage a week or so ago and pushing me to a different tiered plan. This site doesn't get a ton of traffic and Cloudflare's free plan has more robust features than Netlify's, so the time had come. 

It was relatively simple. If you, like me, did not use Netlify's CLI to deploy to your site (i.e., you use the command `npx @11ty/eleventy` to build) then all you need to do is [go to Cloudflare's docs on deplying an 11ty site](https://developers.cloudflare.com/pages/framework-guides/deploy-an-eleventy-site/) and follow along. It is dead simple ... sort of.

The "sort of" is if you use a custom domain. Cloudflare does mostly force you into using them as the primary DNS (at least on the free plan). For me this was fine. 

> [!TIP]
>Before you make the move from Netlify to Cloudflare, I would strongly encourage you to add your domain to Cloudflare first. 

You'll need to [change the nameservers at your registrar](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/#update-your-nameservers) and while activation for me happened pretty quickly, you want to make sure you're not caught in limbo with your site deploying to Cloudflare with the domain down (I think I ran into this for a few minutes). Also, as you're setting up the custom domain, Cloudflare as an Auto DNS feature that will search for your records. I ended up mostly setting them up manually but your mileage may vary. 

The last thing I have to do yet is set up scheduled builds via GitHub Actions to Cloudflare[^1]. This isn't as much of a priority for me now. It deploys automatically after pushing to my repository and I mostly had the action set up because I had webmentions on my site. Since removing those, I don't have much of a need for it anymore. 

Including the wait for the domain to activate on Cloudflare, the total process took me about an hour and a half and the only interaction I had to take with Netlify during it was to delete the site from Netlify once I was sure the DNS records were set and the domain was up and running on Cloudflare. 

[^1]: [Jonas Brusman's](https://jonas.brusman.se/deploy-eleventy-to-cloudflare-with-githubs-action-cache/) and [Cassey Lottman's](https://cassey.dev/11ty-on-cloudflare-pages/) posts on creating an action for this are excellent resources and I will refer back to them when I get around to setting it up.