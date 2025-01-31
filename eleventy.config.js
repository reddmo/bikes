import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import { EleventyRenderPlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import 'dotenv/config';
import markdownit from "markdown-it";
import markdownItGitHubAlerts from 'markdown-it-github-alerts';
import markdownItAttrs from "markdown-it-attrs";
import setLibrary from 'markdown-it-github-alerts';
import markdownItFootnote from 'markdown-it-footnote';
import { full as emoji } from 'markdown-it-emoji';
import eleventyLucideicons from "@grimlink/eleventy-plugin-lucide-icons";
import pluginFilters from "./_config/filters.js";
import EleventyPluginOgImage from 'eleventy-plugin-og-image';
import eleventyAutoCacheBuster from "eleventy-auto-cache-buster";
import fs from 'fs';

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function(eleventyConfig) {

  // Copy the contents of the `public` folder to the output folder
  eleventyConfig
    .addPassthroughCopy({
      "./public/": "/",
      "./node_modules/prismjs/themes/prism-okaidia.css": "/css/prism-okaidia.css"
    })
    .addPassthroughCopy("./content/feed/pretty-atom-feed.xsl");

  // Fonts
  eleventyConfig.addPassthroughCopy("content/assets/fonts/*.{woff,woff2,ttf}");
  
  eleventyConfig.addPassthroughCopy("admin");

  // Mardown-It
  let opt = {
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
};

const md = markdownit(opt)
  .use(markdownItGitHubAlerts)
  .use(markdownItFootnote)
  .use(markdownItAttrs)
  .use(emoji);

  md.renderer.rules.footnote_block_open = () => (
    '<section class="footnotes">\n' +
    '<h4>Footnotes</h4>\n' +
    '<ol class="footnotes-list">\n' 
  );

  // Watch content images for the image pipeline
  eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

  // Per-page bundles (e.g. {% css %} and {% js %} shortcodes)
  eleventyConfig.addBundle("css");
  eleventyConfig.addBundle("js");

  // Add Markdown GitHub Alerts
  eleventyConfig.setLibrary('md', md);

  // Official Eleventy plugins
  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    preAttributes: { tabindex: 0 }
  });
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(eleventyAutoCacheBuster);
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
  eleventyConfig.addPlugin(eleventyLucideicons, {
    "class": "svg",
    "stroke": "currentColor"
  });

	eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(EleventyPluginOgImage, {
    shortcodeOutput: async (ogImage) => `<meta property="og:image" content="https://stuffandthings.lol${await ogImage.outputUrl()}" />`,
    satoriOptions: {
      fonts: [
        {
          name: 'B612',
          data: fs.readFileSync('content/assets/fonts/B612-Bold.ttf'),
          weight: 700,
          style: 'normal',
        },
      ],
    },
  }); 

  // Atom Feed Plugin
  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed/feed.xml",
    stylesheet: "pretty-atom-feed.xsl",
    templateData: {
      eleventyNavigation: {
        key: "Feed",
        order: 7
      }
    },
    collection: {
      name: "posts",
      limit: 10,
    },
    metadata: {
      language: "en",
      title: "stuff&things",
      subtitle: "Just some stuff about things.",
      base: "https://stuffandthings.lol/",
      author: {
        name: "Jason"
      }
    }
  });

  eleventyConfig.addPlugin(feedPlugin, {
    type: "rss",
    outputPath: "/feed/notesfeed.xml",
    stylesheet: "pretty-atom-feed.xsl",
    collection: {
      name: "notes",
      limit: 10,
    },
    metadata: {
      language: "en",
      title: "stuff&things",
      subtitle: "Just some stuff about things.",
      base: "https://stuffandthings.lol/",
      author: {
        name: "Jason"
      }
    }
  });

  // Image optimization
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: "html",
    formats: ["avif", "webp", "jpg", "png", "auto"],
    widths: ["auto"],
    defaultAttributes: {
      loading: "lazy",
      decoding: "async",
    }
  });

  // Filters Plugin
  eleventyConfig.addPlugin(pluginFilters);

  // ID Attribute Plugin
  eleventyConfig.addPlugin(IdAttributePlugin);

  // Shortcode for current build date
  eleventyConfig.addShortcode("currentBuildDate", () => {
    return (new Date()).toISOString();
  });

  // Lucide icons shortcode
  eleventyConfig.addShortcode("lucide", function(eleventyLucideicons) { /* … */ });

  eleventyConfig.addCollection("posts", function (collections) {
		return collections.getFilteredByGlob("content/blog/**/*.md");
	});

  eleventyConfig.addCollection("notes", function (collections) {
		return collections.getFilteredByGlob("content/notes/**/*.md");
	});
}

export const config = {
  templateFormats: [
    "md",
    "njk",
    "html",
    "liquid",
    "11ty.js",
    "webc"  // Add webc template format
  ],

  markdownTemplateEngine: "njk",  // For .md files
  htmlTemplateEngine: "njk",     // For .html files
  webcTemplateEngine: "webc",    // For .webc files

  dir: {
    input: "content",            // Where content lives
    includes: "/_includes",     // Where includes (such as WebC components) are
    svg: "/svg",
    data: "/_data",             // Global data
    output: "_site"             // Output directory
  },
};