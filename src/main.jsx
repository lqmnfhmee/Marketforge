import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { WalletProvider }
  from "./components/context/WalletContext";

import { PocketProvider }
  from "./components/context/PocketContext";

import { AuthProvider }
  from "./components/context/AuthContext";

import { Toaster }
  from "react-hot-toast";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <BrowserRouter>

    <AuthProvider>

      <WalletProvider>

        <PocketProvider>

          <App />

          <Toaster
            position="top-right"
            reverseOrder={false}
          />

        </PocketProvider>

      </WalletProvider>

    </AuthProvider>

  </BrowserRouter>
);