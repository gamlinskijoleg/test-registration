import { useEffect, useState } from "react";
import { TextField, Button, Container, Typography, Paper } from "@mui/material";
import { supabase } from "../supabaseClient";
import bcrypt from "bcryptjs";
import { Link, useNavigate } from "react-router-dom";
import useProtectedRoute from "../hooks/useProtectedRoute";

const ChangePassword = () => {
	const navigate = useNavigate();
	useProtectedRoute();

	const [formData, setFormData] = useState({
		newPassword: "",
	});
	const [message, setMessage] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage("");

		if (!formData.newPassword) {
			setMessage("Please fill in all fields.");
			return;
		}

		const { data, error } = await supabase.auth.updateUser({
			password: formData.newPassword,
		});

		if (!error) {
			navigate("/dashboard");
		}
	};

	return (
		<Container maxWidth="sm">
			<Paper elevation={3} sx={{ mt: 8, p: 4 }}>
				<Typography variant="h5" align="center" gutterBottom>
					Change Password
				</Typography>
				<form onSubmit={handleSubmit}>
					<TextField
						fullWidth
						label="New Password"
						name="newPassword"
						type="password"
						value={formData.newPassword}
						onChange={handleChange}
						margin="normal"
					/>
					<Button
						type="submit"
						variant="contained"
						fullWidth
						sx={{ mt: 2 }}
					>
						Update Password
					</Button>
					{message && (
						<Typography color="textSecondary" sx={{ mt: 2 }}>
							{message}
						</Typography>
					)}
				</form>
			</Paper>
			<Button
				component={Link}
				to="/"
				sx={{ position: "relative", marginTop: 5 }}
			>
				Back
			</Button>
		</Container>
	);
};

export default ChangePassword;
