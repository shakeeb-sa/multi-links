// src/utils/converter.js

export const decodeHTML = (str) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
};

export const isValidURL = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const cleanContent = (htmlContent) => {
  if (!htmlContent) return "";

  // 1. Remove Fragment tags immediately
  let content = htmlContent.replace(/<!--StartFragment-->|<!--EndFragment-->/g, "");

  try {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;

    const allElements = tempDiv.querySelectorAll("*");
    allElements.forEach((element) => {
      // Remove style/class/id
      element.removeAttribute("style");
      element.removeAttribute("class");
      element.removeAttribute("id");

      // Remove attributes
      const attributesToRemove = [
        "color", "bgcolor", "face", "size", "width", "height", 
        "align", "valign", "border", "cellpadding", "cellspacing", 
        "background", "font-family", "font-size", "font-weight", 
        "text-decoration", "line-height", "letter-spacing", 
        "target", "rel"
      ];
      attributesToRemove.forEach((attr) => element.removeAttribute(attr));
      
      // Remove data- and on- events
      Array.from(element.attributes).forEach((attr) => {
        if (attr.name.startsWith("on") || attr.name.startsWith("data-")) {
          element.removeAttribute(attr.name);
        }
      });
    });

    // Simple replacements
    const elementsToReplace = { strong: "b", em: "i", span: "span", div: "div", p: "p" };
    Object.keys(elementsToReplace).forEach((tagName) => {
      const elements = tempDiv.querySelectorAll(tagName);
      elements.forEach((element) => {
        const newElement = document.createElement(elementsToReplace[tagName]);
        while (element.firstChild) newElement.appendChild(element.firstChild);
        element.parentNode.replaceChild(newElement, element);
      });
    });

    return tempDiv.innerHTML;
  } catch (error) {
    console.error("Error cleaning content:", error);
    return content;
  }
};

export const generateFormats = (htmlContent) => {
  if (!htmlContent || htmlContent.trim() === "") return null;

  // 1. Remove Fragment tags immediately here as well
  let content = htmlContent.replace(/<!--StartFragment-->|<!--EndFragment-->/g, "");

  // Basic cleanup for conversion
  content = content
    .replace(/<(div|p|br)[^>]*>/gi, "\n")
    .replace(/<\/(div|p)>/gi, "\n\n")
    .replace(/\s*target=["']?_blank["']?/gi, "")
    .replace(/&nbsp;/gi, " ");

  const anchorRegex = /<a\s+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
  let refCounter = 1;
  let refList = "";

  // 1. HTML
  const htmlVersion = decodeHTML(htmlContent.replace(/<!--StartFragment-->|<!--EndFragment-->/g, "")); 

  // 2. Markdown
  const markdownVersion = content.replace(
    anchorRegex,
    (_, href, text) => `[${decodeHTML(text.trim() || href)}](${decodeHTML(href)})`
  );

  // 3. BBCode
  const bbcodeVersion = content.replace(
    anchorRegex,
    (_, href, text) => `[url=${decodeHTML(href)}]${decodeHTML(text.trim() || href)}[/url]`
  );

  // 4. Raw
  let rawVersion = content.replace(
    anchorRegex,
    (_, href, text) => `[${decodeHTML(href)} ${decodeHTML(text.trim())}];`
  );
  rawVersion = rawVersion.replace(/<[^>]+>/gi, "").replace(/\n{3,}/g, "\n\n").trim();

  // 5. Ref Markdown
  const refMdVersion = content.replace(anchorRegex, (_, href, text) => {
    const label = refCounter++;
    refList += `[${label}]: ${decodeHTML(href)}\n`;
    return `[${decodeHTML(text.trim() || href)}][${label}]`;
  });

  return {
    html: htmlVersion,
    markdown: decodeHTML(markdownVersion),
    bbcode: decodeHTML(bbcodeVersion),
    raw: rawVersion,
    refmd: decodeHTML(refMdVersion + "\n\n" + refList.trim()),
  };
};