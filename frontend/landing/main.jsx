import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BodyCurveLanding from "./BodyCurveLanding";
import Success from "./features/success/Success";

function ExternalRedirect({ to }) {
  useEffect(() => {
    window.location.href = to;
  }, [to]);
  return (
    <div style={{display:"flex",alignItems:"center",
    justifyContent:"center",height:"100vh",
    fontFamily:"sans-serif",color:"#666"}}>
      Redirection en cours...
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BodyCurveLanding />} />
        <Route path="/success" element={<Success />} />
        <Route path="/reservation" element={
          <ExternalRedirect to="https://pzptvmid.mychariow.shop/prd_iuoyld" />
        } />
        <Route path="*" element={<BodyCurveLanding />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
