// js/app.js
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Usamos './sw.js' porque ahora está en la misma carpeta raíz que index.html
    // Esto asegura que el scope sea '/' (toda la aplicación)
    navigator.serviceWorker
      .register("./sw.js")
      .then((registration) => {
        console.log("✅ SW registrado exitosamente:", registration.scope);
      })
      .catch((error) => {
        console.error(" Falló el registro del SW:", error);
      });
  });
}
