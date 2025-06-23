import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import RegisterForm from "./components/auth/Register";
import Dashboardik from "./components/dashboard/Dashboard";
import ChangePassword from "./components/auth/ChangePassword";
import ResetPassword from "./components/auth/resetPassword/ResetPassword";
import ResetPasswordEnterNew from "./components/auth/resetPassword/ResetPasswordEnteNew";
import UploadImage from "./components/image/UploadImage";
import Tasks from "./components/tasks/Tasks";

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
					<Route path="uploadImage" element={<UploadImage />} />
					<Route path="tasks" element={<Tasks />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
