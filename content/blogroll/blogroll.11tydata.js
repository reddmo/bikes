import normalizeUrl from 'normalize-url';
import { AssetCache } from '@11ty/eleventy-fetch';
import RssParser from 'rss-parser';

const rssParser = new RssParser({ timeout: 5000 });

/** Sorter function for an array of feed items with dates */
function sortByDateDescending(feedItemA, feedItemB) {
    const itemADate = new Date(feedItemA.isoDate);
    const itemBDate = new Date(feedItemB.isoDate);
    return itemBDate - itemADate;
}

/** Fetch RSS feed at a given URL and return its latest post (or get it from cache, if possible) */
async function getLatestPost(feedUrl) {
    const asset = new AssetCache(feedUrl);

    // If cache exists, happy day! Use that.	
    if (asset.isCacheValid('1d')) {
        const cachedValue = await asset.getCachedValue();
        return cachedValue;
    }
    const rssPost = await rssParser.parseURL(feedUrl).catch((err) => {
        console.error(feedUrl, err);
        return null;
    }).then((feed) => {
        if (!feed || !feed.items || !feed.items.length) {
            return null;
        }
        const [latest] = [...feed.items].sort(sortByDateDescending);
        if (!latest.title || !latest.link) {
            return null;
        }
        return {
            title: latest.title,
            url: latest.link
        };
    });
    await asset.save(rssPost, 'json');
    return rssPost;
}

export default {
    eleventyComputed: {
        /** Augments blog info with fetched information from the actual blogs */
        async blogData({ blogroll }) {
            const augmentedBlogInfo = await Promise.all(blogroll.map(async (rawBlogInfo) => {
                const encodedUri = encodeURIComponent(rawBlogInfo.url);
                const favicon = `https://v1.indieweb-avatar.11ty.dev/${encodedUri}/`;

                return {
                    ...rawBlogInfo,
                    cleansedUrl: normalizeUrl(
                        rawBlogInfo.url,
                        { stripProtocol: true }
                    ),
                    favicon,
                    latestPost: rawBlogInfo.feed ? await getLatestPost(rawBlogInfo.feed) : null
                };
            }));
            return augmentedBlogInfo;
        }
    }
};
