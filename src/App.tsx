import { useRoutes } from "react-router-dom"
import router from "@/router";

function App() {
    const outlet = useRoutes(router)
    return (
        <div className="App">
            {/* 占位符组件,用于展示组件, 类似vue的router-view */}
            {outlet}
        </div>
    );
}

export default App;
