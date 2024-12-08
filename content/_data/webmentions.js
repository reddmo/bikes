import EleventyFetch from "@11ty/eleventy-fetch";

export default async function () {
  const WEBMENTIONS_STUFF = process.env.WEBMENTION_IO_TOKEN;
  const url = `https://webmention.io/api/mentions.jf2?token=3AkC5K7teZuoGe3NvSNphw&per-page=900`;
  const res = await EleventyFetch(url, {
    duration: "1h",
    type: "json",
  });
  const webmentions = res;
  return {
    mentions: webmentions.children,
  };
}
