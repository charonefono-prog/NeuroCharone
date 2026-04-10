/**
 * Script para forçar o botão de logout a ter position: fixed no web
 * Executa quando o componente é montado
 */
export function forceLogoutButtonFixed() {
  if (typeof window === "undefined") return;

  const observer = new MutationObserver(() => {
    // Procurar por elementos com emoji 🚪 e position absolute
    const allElements = document.querySelectorAll("*");
    allElements.forEach((el) => {
      const style = window.getComputedStyle(el);
      if (
        style.position === "absolute" &&
        el.textContent &&
        el.textContent.includes("🚪") &&
        style.top === "16px" &&
        style.right === "16px"
      ) {
        // Forçar position fixed
        (el as HTMLElement).style.position = "fixed";
        (el as HTMLElement).style.zIndex = "9999";
      }
    });
  });

  // Observar mudanças no DOM
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style"],
  });

  // Executar uma vez imediatamente
  const allElements = document.querySelectorAll("*");
  allElements.forEach((el) => {
    const style = window.getComputedStyle(el);
    if (
      style.position === "absolute" &&
      el.textContent &&
      el.textContent.includes("🚪") &&
      style.top === "16px" &&
      style.right === "16px"
    ) {
      (el as HTMLElement).style.position = "fixed";
      (el as HTMLElement).style.zIndex = "9999";
    }
  });

  return () => observer.disconnect();
}
