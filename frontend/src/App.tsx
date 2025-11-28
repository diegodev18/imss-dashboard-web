import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import EmployeesDashboard from "./pages/Dashboard/Employees";
import TelegramTokensDashboard from "./pages/Dashboard/Telegram/Tokens";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/employees" element={<EmployeesDashboard />} />
        <Route
          path="/dashboard/telegram/tokens"
          element={<TelegramTokensDashboard />}
        />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
