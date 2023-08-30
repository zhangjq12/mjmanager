import { useState } from "react";
import "./App.css";
import { Demo } from "./pages/demo/demo";
import { Home } from "./pages/home";
import { Match } from "./pages/match";

function App() {
  const [chars, setChars] = useState([]);
  const [page, setPage] = useState(1);
  const callback = (chars) => {
    setChars(chars);
    setPage(2);
  };
  const endCallback = () => {
    setPage(1);
  }
  return (
    <div className="App">
      {/* <Home></Home> */}
      {page === 1 && <Demo callback={callback} />}
      {page === 2 && <Match chars={chars} endCallback={endCallback}/>}
    </div>
  );
}

export default App;
