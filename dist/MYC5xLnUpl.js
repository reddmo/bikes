// Thank you to https://github.com/daviddarnes/heading-anchors
// Thank you to https://amberwilson.co.uk/blog/are-your-anchor-links-accessible/

let globalInstanceIndex = 0;

class HeadingAnchors extends HTMLElement {
	static register(tagName) {
		if ("customElements" in window) {
			customElements.define(tagName || "heading-anchors", HeadingAnchors);
		}
	}

	static attributes = {
		exclude: "data-ha-exclude",
		prefix: "prefix",
		content: "content",
	}

	static classes = {
		anchor: "ha",
		placeholder: "ha-placeholder",
		srOnly: "ha-visualhide",
	}

	static defaultSelector = "h2,h3,h4,h5,h6";

	static css = `
.${HeadingAnchors.classes.srOnly} {
	clip: rect(0 0 0 0);
	height: 1px;
	overflow: hidden;
	position: absolute;
	width: 1px;
}
.${HeadingAnchors.classes.anchor} {
	position: absolute;
	left: var(--ha_offsetx);
	top: var(--ha_offsety);
	text-decoration: none;
	opacity: 0;
}
.${HeadingAnchors.classes.placeholder} {
	opacity: .3;
}
.${HeadingAnchors.classes.anchor}:is(:focus-within, :hover) {
	opacity: 1;
}
.${HeadingAnchors.classes.anchor},
.${HeadingAnchors.classes.placeholder} {
	padding: 0 .25em;

	/* Disable selection of visually hidden label */
	-webkit-user-select: none;
	user-select: none;
}

@supports (anchor-name: none) {
	.${HeadingAnchors.classes.anchor} {
		position: absolute;
		left: anchor(left);
		top: anchor(top);
	}
}`;

	get supports() {
		return "replaceSync" in CSSStyleSheet.prototype;
	}

	get supportsAnchorPosition() {
		return CSS.supports("anchor-name: none");
	}

	constructor() {
		super();

		if(!this.supports) {
			return;
		}

		let sheet = new CSSStyleSheet();
		sheet.replaceSync(HeadingAnchors.css);
		document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

		this.headingStyles = {};
		this.instanceIndex = globalInstanceIndex++;
	}

	connectedCallback() {
		if (!this.supports) {
			return;
		}

		this.headings.forEach((heading, index) => {
			if(!heading.hasAttribute(HeadingAnchors.attributes.exclude)) {
				let anchor = this.getAnchorElement(heading);
				let placeholder = this.getPlaceholderElement();

				// Prefers anchor position approach for better accessibility
				// https://amberwilson.co.uk/blog/are-your-anchor-links-accessible/
				if(this.supportsAnchorPosition) {
					let anchorName = `--ha_${this.instanceIndex}_${index}`;
					placeholder.style.setProperty("anchor-name", anchorName);
					anchor.style.positionAnchor = anchorName;
				}

				heading.appendChild(placeholder)
				heading.after(anchor);
			}
		});
	}

	// Polyfill-only
	positionAnchorFromPlaceholder(placeholder) {
		if(!placeholder) {
			return;
		}

		let heading = placeholder.closest("h1,h2,h3,h4,h5,h6");
		if(!heading.nextElementSibling) {
			return;
		}

		// TODO next element could be more defensive
		this.positionAnchor(heading.nextElementSibling);
	}

	// Polyfill-only
	positionAnchor(anchor) {
		if(!anchor || !anchor.previousElementSibling) {
			return;
		}

		// TODO previous element could be more defensive
		let heading = anchor.previousElementSibling;
		this.setFontProp(heading, anchor);

		if(this.supportsAnchorPosition) {
			// quit early
			return;
		}

		let placeholder = heading.querySelector(`.${HeadingAnchors.classes.placeholder}`);
		if(placeholder) {
			anchor.style.setProperty("--ha_offsetx", `${placeholder.offsetLeft}px`);
			anchor.style.setProperty("--ha_offsety", `${placeholder.offsetTop}px`);
		}
	}

	setFontProp(heading, anchor) {
		let placeholder = heading.querySelector(`.${HeadingAnchors.classes.placeholder}`);
		if(placeholder) {
			let style = getComputedStyle(placeholder);
			let props = ["font-weight", "font-size", "line-height", "font-family"];
			let font = props.map(name => style.getPropertyValue(name));
			anchor.style.setProperty("font", `${font[0]} ${font[1]}/${font[2]} ${font[3]}`);
		}
	}

	getAccessibleTextPrefix() {
		// Useful for i18n
		return this.getAttribute(HeadingAnchors.attributes.prefix) || "Jump to section titled";
	}

	getContent() {
		return this.getAttribute(HeadingAnchors.attributes.content) || "#";
	}

	getPlaceholderElement() {
		let ph = document.createElement("span");
		ph.setAttribute("aria-hidden", true);
		ph.classList.add(HeadingAnchors.classes.placeholder);
		ph.textContent = this.getContent();

		ph.addEventListener("mouseover", (e) => {
			let placeholder = e.target.closest(`.${HeadingAnchors.classes.placeholder}`);
			if(placeholder) {
				this.positionAnchorFromPlaceholder(placeholder);
			}
		});

		return ph;
	}

	getAnchorElement(heading) {
		let anchor = document.createElement("a");
		anchor.href = `#${heading.id}`;
		anchor.classList.add(HeadingAnchors.classes.anchor);

		let content = this.getContent();
		anchor.innerHTML = `<span class="${HeadingAnchors.classes.srOnly}">${this.getAccessibleTextPrefix()}: ${heading.textContent}</span><span aria-hidden="true">${content}</span>`;

		anchor.addEventListener("focus", e => {
			let anchor = e.target.closest(`.${HeadingAnchors.classes.anchor}`);
			if(anchor) {
				this.positionAnchor(anchor);
			}
		});

		anchor.addEventListener("mouseover", (e) => {
			// when CSS anchor positioning is supported, this is only used to set the font
			let anchor = e.target.closest(`.${HeadingAnchors.classes.anchor}`);
			this.positionAnchor(anchor);
		});

		return anchor;
	}

	get headings() {
		return this.querySelectorAll(this.selector.split(",").map(entry => `${entry.trim()}[id]`));
	}

	get selector() {
		return this.getAttribute("selector") || HeadingAnchors.defaultSelector;
	}
}

HeadingAnchors.register();

export { HeadingAnchors }
class Snow extends HTMLElement {
	static random(min, max) {
		return min + Math.floor(Math.random() * (max - min) + 1);
	}

	static attrs = {
		count: "count", // default: 100
		mode: "mode",
		text: "text", // text in snow flake (emoji, too)
	}

	generateCss(mode, count) {
		let css = [];
		css.push(`
:host([mode="element"]) {
	display: block;
	position: relative;
	overflow: hidden;
}
:host([mode="page"]) {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
}
:host([mode="page"]),
:host([mode="element"]) > * {
	pointer-events: none;
}
:host([mode="element"]) ::slotted(*) {
	pointer-events: all;
}
* {
	position: absolute;
}
:host([text]) * {
	font-size: var(--snow-fall-size, 1em);
}
:host(:not([text])) * {
	width: var(--snow-fall-size, 10px);
	height: var(--snow-fall-size, 10px);
	background: var(--snow-fall-color, rgba(255,255,255,.5));
	border-radius: 50%;
}
`);

		// using vw units (max 100)
		let dimensions = { width: 100, height: 100 };
		let units = { x: "vw", y: "vh"};

		if(mode === "element") {
			dimensions = {
				width: this.firstElementChild.clientWidth,
				height: this.firstElementChild.clientHeight,
			};
			units = { x: "px", y: "px"};
		}

		// Thank you @alphardex: https://codepen.io/alphardex/pen/dyPorwJ
		for(let j = 1; j<= count; j++ ) {
			let x = Snow.random(1, 100) * dimensions.width/100; // vw
			let offset = Snow.random(-10, 10) * dimensions.width/100; // vw

			let yoyo = Math.round(Snow.random(30, 100)); // % time
			let yStart = yoyo * dimensions.height/100; // vh
			let yEnd = dimensions.height; // vh

			let scale = Snow.random(1, 10000) * .0001;
			let duration = Snow.random(10, 30);
			let delay = Snow.random(0, 30) * -1;

			css.push(`
:nth-child(${j}) {
	opacity: ${Snow.random(0, 1000) * 0.001};
	transform: translate(${x}${units.x}, -10px) scale(${scale});
	animation: fall-${j} ${duration}s ${delay}s linear infinite;
}

@keyframes fall-${j} {
	${yoyo}% {
		transform: translate(${x + offset}${units.x}, ${yStart}${units.y}) scale(${scale});
	}

	to {
		transform: translate(${x + offset / 2}${units.x}, ${yEnd}${units.y}) scale(${scale});
	}
}`)
		}
		return css.join("\n");
	}

	connectedCallback() {
		// https://caniuse.com/mdn-api_cssstylesheet_replacesync
		if(this.shadowRoot || !("replaceSync" in CSSStyleSheet.prototype)) {
			return;
		}

		let count = parseInt(this.getAttribute(Snow.attrs.count)) || 100;

		let mode;
		if(this.hasAttribute(Snow.attrs.mode)) {
			mode = this.getAttribute(Snow.attrs.mode);
		} else {
			mode = this.firstElementChild ? "element" : "page";
			this.setAttribute(Snow.attrs.mode, mode);
		}

		let sheet = new CSSStyleSheet();
		sheet.replaceSync(this.generateCss(mode, count));

		let shadowroot = this.attachShadow({ mode: "open" });
		shadowroot.adoptedStyleSheets = [sheet];

		let d = document.createElement("div");
		let text = this.getAttribute(Snow.attrs.text);
		d.innerText = text || "";
		for(let j = 0, k = count; j<k; j++) {
			shadowroot.appendChild(d.cloneNode(true));
		}

		shadowroot.appendChild(document.createElement("slot"));
	}
}

customElements.define("snow-fall", Snow);
class Island extends HTMLElement {
  static tagName = "is-land";
  static prefix = "is-land--";
  static attr = {
    template: "data-island",
    ready: "ready",
    defer: "defer-hydration",
  };

  static onceCache = new Map();
  static onReady = new Map();

  static fallback = {
    ":not(is-land,:defined,[defer-hydration])": (readyPromise, node, prefix) => {
      // remove from document to prevent web component init
      let cloned = document.createElement(prefix + node.localName);
      for(let attr of node.getAttributeNames()) {
        cloned.setAttribute(attr, node.getAttribute(attr));
      }
    
      // Declarative Shadow DOM (with polyfill)
      let shadowroot = node.shadowRoot;
      if(!shadowroot) {
        let tmpl = node.querySelector(":scope > template:is([shadowrootmode], [shadowroot])");
        if(tmpl) {
          let mode = tmpl.getAttribute("shadowrootmode") || tmpl.getAttribute("shadowroot") || "closed";
          shadowroot = node.attachShadow({ mode }); // default is closed
          shadowroot.appendChild(tmpl.content.cloneNode(true));
        }
      }
    
      // Cheers to https://gist.github.com/developit/45c85e9be01e8c3f1a0ec073d600d01e
      if(shadowroot) {
        cloned.attachShadow({ mode: shadowroot.mode }).append(...shadowroot.childNodes);
      }
    
      // Keep *same* child nodes to preserve state of children (e.g. details->summary)
      cloned.append(...node.childNodes);
      node.replaceWith(cloned);
    
      return readyPromise.then(() => {
        // Restore original children and shadow DOM
        if(cloned.shadowRoot) {
          node.shadowRoot.append(...cloned.shadowRoot.childNodes);
        }
        node.append(...cloned.childNodes);
        cloned.replaceWith(node);
      });
    }
  }

  constructor() {
    super();

    // Internal promises
    this.ready = new Promise(resolve => {
      this.readyResolve = resolve;
    });
  }

  // any parents of `el` that are <is-land> (with conditions)
  static getParents(el, stopAt = false) {
    let nodes = [];
    while(el) {
      if(el.matches && el.matches(Island.tagName)) {
        if(stopAt && el === stopAt) {
          break;
        }

        if(Conditions.hasConditions(el)) {
          nodes.push(el);
        }
      }
      el = el.parentNode;
    }
    return nodes;
  }

  static async ready(el, parents) {
    if(!parents) {
      parents = Island.getParents(el);
    }
    if(parents.length === 0) {
      return;
    }
    let imports = await Promise.all(parents.map(p => p.wait()));
    // return innermost module import
    if(imports.length) {
      return imports[0];
    }
  }

  forceFallback() {
    if(window.Island) {
      Object.assign(Island.fallback, window.Island.fallback);
    }

    for(let selector in Island.fallback) {
      // Reverse here as a cheap way to get the deepest nodes first
      let components = Array.from(this.querySelectorAll(selector)).reverse();

      // with thanks to https://gist.github.com/cowboy/938767
      for(let node of components) {
        if(!node.isConnected) {
          continue;
        }

        let parents = Island.getParents(node);
        // must be in a leaf island (not nested deep)
        if(parents.length === 1) {
          let p = Island.ready(node, parents);
          Island.fallback[selector](p, node, Island.prefix);
        }
      }
    }
  }

  wait() {
    return this.ready;
  }

  async connectedCallback() {
    // Only use fallback content with loading conditions
    if(Conditions.hasConditions(this)) {
      // Keep fallback content without initializing the components
      this.forceFallback();
    }

    await this.hydrate();
  }

  getTemplates() {
    return this.querySelectorAll(`template[${Island.attr.template}]`);
  }

  replaceTemplates(templates) {
    // replace <template> with the live content
    for(let node of templates) {
      // if the template is nested inside another child <is-land> inside, skip
      if(Island.getParents(node, this).length > 0) {
        continue;
      }

      let value = node.getAttribute(Island.attr.template);
      // get rid of the rest of the content on the island
      if(value === "replace") {
        let children = Array.from(this.childNodes);
        for(let child of children) {
          this.removeChild(child);
        }
        this.appendChild(node.content);
        break;
      } else {
        let html = node.innerHTML;
        if(value === "once" && html) {
          if(Island.onceCache.has(html)) {
            node.remove();
            return;
          }

          Island.onceCache.set(html, true);
        }

        node.replaceWith(node.content);
      }
    }
  }

  async hydrate() {
    let conditions = [];
    if(this.parentNode) {
      // wait for all parents before hydrating
      conditions.push(Island.ready(this.parentNode));
    }

    let attrs = Conditions.getConditions(this);
    for(let condition in attrs) {
      if(Conditions.map[condition]) {
        conditions.push(Conditions.map[condition](attrs[condition], this));
      }
    }

    // Loading conditions must finish before dependencies are loaded
    await Promise.all(conditions);

    this.replaceTemplates(this.getTemplates());

    for(let fn of Island.onReady.values()) {
      await fn.call(this, Island);
    }

    this.readyResolve();

    this.setAttribute(Island.attr.ready, "");

    // Remove [defer-hydration]
    this.querySelectorAll(`[${Island.attr.defer}]`).forEach(node => node.removeAttribute(Island.attr.defer));
  }
}

class Conditions {
  static map = {
    visible: Conditions.visible,
    idle: Conditions.idle,
    interaction: Conditions.interaction,
    media: Conditions.media,
    "save-data": Conditions.saveData,
  };

  static hasConditions(node) {
    return Object.keys(Conditions.getConditions(node)).length > 0;
  }

  static getConditions(node) {
    let map = {};
    for(let key of Object.keys(Conditions.map)) {
      if(node.hasAttribute(`on:${key}`)) {
        map[key] = node.getAttribute(`on:${key}`);
      }
    }

    return map;
  }

  static visible(noop, el) {
    if(!('IntersectionObserver' in window)) {
      // runs immediately
      return;
    }

    return new Promise(resolve => {
      let observer = new IntersectionObserver(entries => {
        let [entry] = entries;
        if(entry.isIntersecting) {
          observer.unobserve(entry.target);
          resolve();
        }
      });

      observer.observe(el);
    });
  }

  // Warning: on:idle is not very useful with other conditions as it may resolve long before.
  static idle() {
    let onload = new Promise(resolve => {
      if(document.readyState !== "complete") {
        window.addEventListener("load", () => resolve(), { once: true });
      } else {
        resolve();
      }
    });

    if(!("requestIdleCallback" in window)) {
      // run immediately
      return onload;
    }

    // both idle and onload
    return Promise.all([
      new Promise(resolve => {
        requestIdleCallback(() => {
          resolve();
        });
      }),
      onload,
    ]);
  }

  static interaction(eventOverrides, el) {
    let events = ["click", "touchstart"];
    // event overrides e.g. on:interaction="mouseenter"
    if(eventOverrides) {
      events = (eventOverrides || "").split(",").map(entry => entry.trim());
    }

    return new Promise(resolve => {
      function resolveFn(e) {
        resolve();

        // cleanup the other event handlers
        for(let name of events) {
          el.removeEventListener(name, resolveFn);
        }
      }

      for(let name of events) {
        el.addEventListener(name, resolveFn, { once: true });
      }
    });
  }

  static media(query) {
    let mm = {
      matches: true
    };

    if(query && ("matchMedia" in window)) {
      mm = window.matchMedia(query);
    }

    if(mm.matches) {
      return;
    }

    return new Promise(resolve => {
      mm.addListener(e => {
        if(e.matches) {
          resolve();
        }
      });
    });
  }

  static saveData(expects) {
    // return early if API does not exist
    if(!("connection" in navigator) || navigator.connection.saveData === (expects !== "false")) {
      return;
    }

    // dangly promise
    return new Promise(() => {});
  }
}

// Should this auto define? Folks can redefine later using { component } export
if("customElements" in window) {
  window.customElements.define(Island.tagName, Island);
  window.Island = Island;
}

export {
  Island,
  Island as component, // Backwards compat only: recommend `Island` export
};

// TODO remove in 4.0
export const ready = Island.ready; // Backwards compat only: recommend `Island` export