import { Outlet, Link } from "react-router-dom"

function App() {
  return (
    <div className="App">
      <Link to={'home'}>Home</Link> |
      <Link to={'about'}>About</Link>
      {/* 占位符组件,用于展示组件, 类似vue的router-view */}
      <Outlet></Outlet>
    </div>
  );
}

export default App;
