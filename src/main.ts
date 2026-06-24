import "./styles/main.css";
import { config } from "./lib/config";
import { setText } from "./lib/dom";

// Página de inicio. La configuración pública viene de import.meta.env
// (ver lib/config.ts). No hay secretos ni HTML inyectado: solo textContent.
setText(document.getElementById("app-title"), config.appName);
setText(document.getElementById("footer-name"), config.appName);
