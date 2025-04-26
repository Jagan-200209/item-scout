import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Find from "./pages/Find"
import Post from "./pages/Post";
import Details from "./pages/Details";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/find' element={<Find />} />
        <Route path='/post' element={<Post />} />
        <Route path='/find/details/:id' element={<Details />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
