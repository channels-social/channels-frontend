export const getAppPrefix = () => {
  const path = window.location.pathname;
  return path.startsWith("/embed/channels") ? "/embed/channels" : "";
};
