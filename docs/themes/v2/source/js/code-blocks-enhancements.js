// if localhost, use local playground
function getLabelStudioPlaygroundUrl() {
  if (window.location.hostname === "localhost") {
    return "http://localhost:4200/";
  }
  if (window.location.hostname === "labelstud.io") {
    return "https://labelstud.io/playground-app/";
  }
  // This is for preview deployments
  return "https://label-studio-playground.netlify.app/";
}

function normalizeNewlines(text) {
  return text.replace(/(\r\n|\r)/gm, "\n");
}

function encodeConfig(text) {
  return encodeURIComponent(normalizeNewlines(text));
}

function editorIframe(config, modal, id, inline = false) {
  // generate new iframe
  const iframeTemplate = `<iframe id="render-editor-${id}" class="api-render-editor" style="display:none"></iframe>`;

  modal.insertAdjacentHTML("beforeend", iframeTemplate);

  const iframe = document.querySelector(`#render-editor-${id}`);
  const spinner = modal.querySelector(".render-editor-loader");

  iframe.addEventListener("load", function () {
    if (spinner) spinner.style.display = "none";
    iframe.style.display = "block";
  });

  const templateValue = encodeConfig(config);

  iframe.src = `${getLabelStudioPlaygroundUrl()}?config=${templateValue}&mode=${inline ? "preview-inline" : "preview"}`;
}

function showRenderEditor(config) {
  const id = `id${Math.random().toString(16).slice(2)}`;
  const body = document.querySelector("body");
  const modalTemplate = `
  <div id="preview-wrapper-${id}" class="api-preview-wrapper" onclick="this.remove()">
    <div class="render-editor-loader"><img width="50px" src="/images/design/loading.gif"></div>
  </div>
  `;
  body.insertAdjacentHTML("beforeend", modalTemplate);

  const modal = document.querySelector(`#preview-wrapper-${id}`);

  editorIframe(config, modal, id);
}

(function () {
  const codeBlocks = document.querySelectorAll('code[class*="hljs"]');

  const handleCopy = (event) => {
    event.preventDefault();

    const CheckIcon = event.currentTarget.querySelector(".code-block-copy-check-icon");
    const CopyIcon = event.currentTarget.querySelector(".code-block-copy-copy-icon");

    const text = event.currentTarget.nextElementSibling.textContent;

    navigator.clipboard.writeText(text).then(() => {
      CopyIcon.style.display = "none";
      CheckIcon.style.display = "block";

      // Hide after 3 seconds
      setTimeout(() => {
        CopyIcon.style.display = "block";
        CheckIcon.style.display = "none";
      }, 3000);
    });
  };

  const addCopyCodeButton = (codeBlock, language) => {
    const pre = codeBlock.parentElement;
    const htmlTemplate = `
      <button class="code-block-copy-button" arial-label="Copy ${language} code">
        ${language}
        <svg viewBox="0 0 24 24" width="24" height="24" class="code-block-copy-copy-icon"><path fill="currentColor" d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1z"></path></svg>
        <svg viewBox="0 0 24 24" width="24" height="24" class="code-block-copy-check-icon"><path fill="currentColor" d="m9 20.42-6.21-6.21 2.83-2.83L9 14.77l9.88-9.89 2.83 2.83L9 20.42z"></path></svg>
      </button>`;

    pre.insertAdjacentHTML("afterBegin", htmlTemplate);

    const button = pre.querySelector(".code-block-copy-button");
    button.addEventListener("click", handleCopy);
  };

  const addPlaygroundButtons = (codeBlock) => {
    const pre = codeBlock.parentElement;
    const code = codeBlock.textContent;
    const htmlTemplate = `
    <div class="playground-buttons">
      <button class="code-block-open-preview">Open Preview</button>
      <a href="/playground/?config=${encodeConfig(code)}" target="_blank" rel="noreferrer noopener">Launch in Playground</a>
    </div>
    `;
    pre.insertAdjacentHTML("beforeend", htmlTemplate);

    const openPreviewButton = pre.querySelector(".code-block-open-preview");
    openPreviewButton.addEventListener("click", () => showRenderEditor(code));

    const inlinePlayground = document.querySelector("#main-preview");

    if (inlinePlayground) editorIframe(code, inlinePlayground, "inline", true);
  };

  const enhanceCodeBlocks = (codeBlock) => {
    const language = codeBlock.classList[1];

    if (language === "html") addPlaygroundButtons(codeBlock);

    addCopyCodeButton(codeBlock, language);
  };

  codeBlocks.forEach((block) => enhanceCodeBlocks(block));
})();
