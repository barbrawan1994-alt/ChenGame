export const isMobileDevice = (platform = {}) => Boolean(
  platform.userAgentData?.mobile ||
  /Android|iPhone|iPad|iPod/i.test(platform.userAgent || '') ||
  (/Mac/i.test(platform.platform || '') && platform.maxTouchPoints > 1)
);
