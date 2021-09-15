export default function copyClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.style.cssText = "w:0px; h:0px; opacity:0;";
  textArea.value = text;
  document.body.append(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
}
