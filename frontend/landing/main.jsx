import { BrowserRouter, Routes, Route } from "react-router-dom";
import BodyCurveLanding from "./BodyCurveLanding";
import Reservation from "./Reservation";
import Success from "./features/success/Success";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BodyCurveLanding />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
}
