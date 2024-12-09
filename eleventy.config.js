import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import { EleventyRenderPlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import 'dotenv/config';
import markdownit from "markdown-it";
import markdownItGitHubAlerts from 'markdown-it-github-alerts';
import setLibrary from 'markdown-it-github-alerts';
import eleventyLucideicons from "@grimlink/eleventy-plugin-lucide-icons";
import pluginFilters from "./_config/filters.js";
import WebCPlugin from "@11ty/eleventy-plugin-webc";

let opt = {
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
};

const md = markdownit(opt);
md.use(markdownItGitHubAlerts);

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
  eleventyConfig.addPassthroughCopy("./content/assets/fonts");

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
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
  eleventyConfig.addPlugin(eleventyLucideicons, {
    "class": "custom-class",
    "align-item": "center",
    "stroke": "currentColor",
    "stroke-width": 6
  });

  // Enable the WebC plugin to handle .webc files
  eleventyConfig.addPlugin(WebCPlugin, {
    // Options for WebC can be added here if needed, for example:
    components: "./content/_includes/components/**/*.webc"
  });

	eleventyConfig.addPlugin(EleventyRenderPlugin);

  // Atom Feed Plugin
  eleventyConfig.addPlugin(feedPlugin, {
    outputPath: "/feed/feed.xml",
    stylesheet: "pretty-atom-feed.xsl",
    templateData: {
      eleventyNavigation: {
        key: "Feed",
        order: 5
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
