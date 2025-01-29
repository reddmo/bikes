import fetch from '@11ty/eleventy-fetch';
import 'dotenv/config';

const { MASTO_TOKEN } = process.env;
const MASTODON_INSTANCE = 'https://social.lol';  // Replace with your Mastodon instance URL
const ACCOUNT_ID = '112261814225919105';  // Replace with your actual account ID

export default async () => {
    // The URL for the Mastodon API request to fetch statuses for a specific account
    const url = `${MASTODON_INSTANCE}/api/v1/accounts/${ACCOUNT_ID}/statuses`;
  
    try {
      // Fetch the posts and cache them for 1 hour
      const posts = await fetch(url, {
        duration: '1h',  // Cache duration
        fetchOptions: {
          headers: {
            'Authorization': `Bearer ${MASTO_TOKEN}`,  // Authorization header
          },
        },
      });
  
      // Log the posts to ensure they are fetched correctly
      console.log(posts);
  
      // Optionally, sort posts by `created_at` to display the newest first
      posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
      const latestPosts = posts.slice(0, 20);

    return latestPosts;  // Return the newest 20 posts
  } catch (error) {
    // Log and return an empty array if there's an error with the API request
    console.error('Error fetching Mastodon posts:', error);
    return [];
  }
};