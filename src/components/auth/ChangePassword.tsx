import { useState, ChangeEvent, FormEvent } from "react";
import { TextField, Button, Container, Typography, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import useProtectedRoute from "../../hooks/useProtectedRoute";
import supabaseUser from "../../services/auth";

const ChangePassword = () => {
	const navigate = useNavigate();
	useProtectedRoute();

	const [formData, setFormData] = useState<{ newPassword: string }>({
		newPassword: "",
	});
	const [errorMessage, setErrorMessage] = useState<string>("");

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setErrorMessage("");
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrorMessage("");

		if (!formData.newPassword) {
			setErrorMessage("Please fill in the password.");
			return;
		}

		if (formData.newPassword.length < 8) {
			setErrorMessage("Password must be at least 8 characters.");
			return;
		}

		const { error } = await supabaseUser.UpdateUserPassword(
			formData.newPassword
		);

		if (!error) {
			navigate(-1);
		} else {
			setErrorMessage("Failed to update password.");
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
						error={!!errorMessage}
						helperText={errorMessage}
					/>
					<Button
						type="submit"
						variant="contained"
						fullWidth
						sx={{ mt: 2 }}
					>
						Update Password
					</Button>
				</form>
			</Paper>
			<Button
				component={Link}
				to="/dashboard"
				sx={{ position: "relative", marginTop: 5 }}
			>
				Back
			</Button>
		</Container>
	);
};

export default ChangePassword;
