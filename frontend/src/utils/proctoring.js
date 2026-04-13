export const startProctoring = (onWarning) => {
  // 1. Tab switch detection
  const handleVisibilityChange = () => {
    if (document.hidden) {
      onWarning("Tab switch detected. Please stay on the exam tab.");
    }
  };
  document.addEventListener("visibilitychange", handleVisibilityChange);

  // 2. Disable Right Click
  const handleContextMenu = (e) => {
    e.preventDefault();
  };
  document.addEventListener("contextmenu", handleContextMenu);

  // 3. Disable Copy, Paste, Cut
  const handleKeyDown = (e) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === "c" || e.key === "v" || e.key === "x")
    ) {
      e.preventDefault();
      onWarning("Copy/Paste/Cut operations are disabled.");
    }
  };
  document.addEventListener("keydown", handleKeyDown);

  // 4. Detect Window Resize (Simple DevTools heuristic)
  const handleResize = () => {
    const threshold = 160;
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
      onWarning("Please maximize your window and close DevTools.");
    }
  };
  window.addEventListener("resize", handleResize);

  // 5. Fullscreen detection
  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      onWarning("You exited fullscreen. Please return to fullscreen mode.");
    }
  };
  document.addEventListener("fullscreenchange", handleFullscreenChange);

  // Cleanup function
  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    document.removeEventListener("contextmenu", handleContextMenu);
    document.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("resize", handleResize);
    document.removeEventListener("fullscreenchange", handleFullscreenChange);
  };
};
