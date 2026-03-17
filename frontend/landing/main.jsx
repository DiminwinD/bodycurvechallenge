import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BodyCurveLanding from "./BodyCurveLanding";
import Reservation from "./Reservation";
import Success from "./features/success/Success";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BodyCurveLanding />} />
        <Route path="/reservation" element={<Navigate to="https://pzptvmid.mychariow.shop/prd_iuoyld" replace />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
}
