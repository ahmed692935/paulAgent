import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PublicRoute from "./routes/public";
import { Toaster } from "react-hot-toast";
import SignIn from "./pages/Auth/signIn";
import SignUp from "./pages/Auth/signUp";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/private";
import CallForm from "./pages/CallForm";
import AddPrompt from "./pages/AddPrompt";
import LandingPage from "./pages/LandingPage";
import UploadCsv from "./pages/UploadCsv";
import AgentVoice from "./pages/AgentVoice"

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              // <PublicRoute>
              <LandingPage />
              // </PublicRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              // <PublicRoute>
              <SignUp />
              // </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-prompt"
            element={
              <PrivateRoute>
                <AddPrompt />
              </PrivateRoute>
            }
          />
          <Route
            path="/upload-csv"
            element={
              <PrivateRoute>
                <UploadCsv />
              </PrivateRoute>
            }
          />
          <Route
            path="/call"
            element={
              <PrivateRoute>
                <CallForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/voice"
            element={
              <PrivateRoute>
                <AgentVoice />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
