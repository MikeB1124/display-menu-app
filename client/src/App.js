import Home from "./pages/Home";
import Board from "./modules/Board";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BoardManager from "./modules/BoardManager";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route>
            <Route index element={<Home/>} />
            <Route path="/boards" element={<Board/>} />
            <Route path="/boardmanager" element={<BoardManager/>} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;