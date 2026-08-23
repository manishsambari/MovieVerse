import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Search from "./pages/Search";
import MovieDetail from "./pages/MovieDetail";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
    const { user } = useContext(AuthContext);

    const RequireAuth = ({ children }) => {
        return user ? children : <Navigate to="/login" replace />;
    };

    const RequireAdmin = ({ children }) => {
        return user && user.role === 'admin' ? children : <Navigate to="/" replace />;
    };

    return (
        <BrowserRouter>
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0c0d12' }}>
                <Navbar />
                <Box component="main" sx={{ flexGrow: 1 }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
                        <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/movie/:id" element={<MovieDetail />} />
                        <Route
                            path="/profile"
                            element={
                                <RequireAuth>
                                    <Profile />
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <RequireAdmin>
                                    <AdminDashboard />
                                </RequireAdmin>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Box>
                <Footer />
            </Box>
        </BrowserRouter>
    );
}

export default App;
