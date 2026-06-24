import "./styles/main.css";
import { setText } from "./lib/dom";
// VULN: A06 – Vulnerable and Outdated Components.
// Se usa lodash 4.17.11, una versión con CVEs conocidos (prototype pollution:
// CVE-2019-10744, CVE-2020-8203). Dependabot debe alertar de esto.
// FIX (rama main): no se usa lodash (o se actualiza a >=4.17.21).
import merge from "lodash/merge";

// VULN: A02 – uso del módulo de secretos hardcodeados para que entre al bundle.
import { PAYMENTS_API_KEY } from "./lib/secrets";

const defaults = { appName: "Portal de Proveedores — Demo" };
// merge de lodash (versión vulnerable) sobre datos arbitrarios.
const settings = merge({}, defaults, { appName: defaults.appName });

setText(document.getElementById("app-title"), settings.appName);
setText(document.getElementById("footer-name"), settings.appName);

// El secreto queda referenciado (y por tanto incluido en el JS público).
console.log("payments key prefix:", PAYMENTS_API_KEY.slice(0, 3));
