import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BodyCurveLanding from "./BodyCurveLanding";
import Success from "./features/success/Success";

function ExternalRedirect({ to }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BodyCurveLanding />} />
        <Route path="/reservation" element={<ExternalRedirect to="https://pzptvmid.mychariow.shop/prd_iuoyld" />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
}
