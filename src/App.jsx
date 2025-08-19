import { useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Mlcomp from "./MLTrainingPlatform";
import MLTrainingPlatform from "./MLTrainingPlatform";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MLTrainingPlatform />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
