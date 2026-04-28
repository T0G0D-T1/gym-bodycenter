import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
//importing react slick slider
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { animateScroll } from "react-scroll";
import NavBar from "./components/organs/NavBar"
import Home from "./components/pages/Home";
import Footer from "./components/organs/Footer";

import React from "react";
import { FloatingWhatsApp } from "react-floating-whatsapp";

import Ubicacion from "./components/pages/Ubicacion";



function App() {

  const directory = useLocation();
  useEffect(() => {
    animateScroll.scrollToTop({
      duration: 0,
    });
  }, [directory.pathname]);

  return (
    <div className="w-full h-full bg-zinc-900 font-nunito relative">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ubicacion" element={<Ubicacion />} />
      </Routes>
      <Footer />
      <FloatingWhatsApp
        phoneNumber="56947977983"
        accountName="Body Center SPA"
        chatMessage="Hola 👋 ¿En qué podemos ayudarte?"
        statusMessage="Respondemos rápido 💪"
        placeholder="Escribe tu consulta..."
        notification={true}
        notificationDelay={5}
        allowClickAway={true}
        allowEsc={true}
        avatar="/favicon.jpg"
        darkMode={true}
      />
    </div>
  )
}

export default App
