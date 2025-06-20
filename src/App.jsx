import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import RegisterForm from "./components/Register";
import bcrypt from "bcryptjs";
import Dashboardik from "./components/Dashboard";
import ChangePassword from "./components/ChangePassword";
import ResetPassword from "./components/ResetPassword";
import ResetPasswordEnterNew from "./components/ResetPasswordEnteNew";

export async function hashPassword(password) {
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);
	return hash;
}

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="login" element={<Login />} />
					<Route path="register" element={<RegisterForm />} />
					<Route path="dashboard" element={<Dashboardik />} />
					<Route path="changePassword" element={<ChangePassword />} />
					<Route path="resetPassword" element={<ResetPassword />} />
					<Route
						path="resetPasswordEnterCode"
						element={<ResetPasswordEnterNew />}
					/>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
