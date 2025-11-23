export const getParentUrl = () => {
  // Check if in iframe, use labelstud.io playground url as fallback
  if (window.self !== window.top) {
    const url = "https://labelstud.io/playground/";

    return new URL(url);
  }

  return new URL(window.location.href);
};
