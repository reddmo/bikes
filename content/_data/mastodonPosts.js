import fetch from '@11ty/eleventy-fetch';
import 'dotenv/config';

const { MASTO_TOKEN } = process.env;
const MASTODON_INSTANCE = 'https://social.lol';  // Replace with your Mastodon instance URL
const ACCOUNT_ID = '112261814225919105';  // Replace with your actual account ID

export default async () => {
    // The URL for the Mastodon API request to fetch statuses for a specific account
    const url = `${MASTODON_INSTANCE}/api/v1/accounts/${ACCOUNT_ID}/statuses`;
  
    try {
        // Fetch the data from Mastodon API and cache for 1 hour
        const postsBuffer = await fetch(url, {
          duration: '1h',  // Cache duration
          fetchOptions: {
            headers: {
              'Authorization': `Bearer ${MASTO_TOKEN}`,
            },
          },
        });
    
      // Convert the Buffer to a string
      const postsJsonStr = postsBuffer.toString();  // Convert Buffer to string

      // Parse the string into a JSON object
      const posts = JSON.parse(postsJsonStr);  // Convert the string to JSON
  
      // Log the posts to verify

      // Filter out replies and reposts (boosts)
      
      const filteredPosts = posts.filter(post => !post.in_reply_to_id && !post.reblog);

      // Sort posts by `created_at` (newest first)
      filteredPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
      // Limit to the newest 20 posts
      const latestPosts = filteredPosts.slice(0, 200);
  
      return latestPosts;  // Return the latest 40 posts
    } catch (error) {
      console.error('Error fetching Mastodon posts:', error);
      return [];
    }
  };