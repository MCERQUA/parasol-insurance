import React from "react";
import ReactDOM from "react-dom/client";
import App from '@app/index';

// Disable react-axe completely for now to avoid any potential issues
// if (process.env.NODE_ENV !== "production") {
//   const config = {
//     rules: [
//       {
//         id: 'color-contrast',
//         enabled: false
//       }
//     ]
//   };
//   // eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
//   const axe = require("react-axe");
//   axe(React, ReactDOM, 1000, config);
// }

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
