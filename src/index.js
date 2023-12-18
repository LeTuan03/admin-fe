import React, { Suspense, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Router from "./routers/routes";
import reportWebVitals from "./reportWebVitals";

function App() {
  useEffect(() => {
    const handleUnload = () => {
      console.log(1);
      localStorage.removeItem("token");
    };

    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, []);
  return (
    <div>
      <Suspense fallback={null}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
