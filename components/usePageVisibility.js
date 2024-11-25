document.addEventListener("DOMContentLoaded", function () {
 function usePageVisibility(message) {
  let previousTitle = document.title;
  const handleBlur = () => {
   previousTitle = document.title;
   document.title = message;
  };
  const handleFocus = () => {
   document.title = previousTitle;
  };
  window.addEventListener("blur", handleBlur);
  window.addEventListener("focus", handleFocus);
  return { previousTitle };
 }
 const { previousTitle } = usePageVisibility("E-Smarthy te extraña! =(");
});