import React, { useState, ChangeEvent, FormEvent } from "react";
import {
	TextField,
	Button,
	Container,
	Typography,
	Box,
	Paper,
	Alert,
	Stack,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import supabaseUser from "../../services/auth";

const RegisterForm = () => {
	const [formData, setFormData] = useState<{
		name: string;
		email: string;
		password: string;
		confirmPassword: string;
	}>({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [error, setError] = useState<string>("");
	const [success, setSuccess] = useState<string>("");

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setError("");
		setSuccess("");
	};

	const isCorrectUser = () => {
		const { name, email, password, confirmPassword } = formData;

		return (
			password.length >= 6 &&
			password === confirmPassword &&
			name.trim() !== "" &&
			email.trim() !== ""
		);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!isCorrectUser()) {
			setError("Please review your input.");
			return;
		}

		const { email, password } = formData;
		const { data, error } = await supabaseUser.Register(email, password);

		if (error) {
			console.error("Signup error:", error);
			setError("Signup failed: " + error.message);
			setSuccess("");
		} else {
			setSuccess("Confirmation link sent! Please check your email.");
			setError("");
		}
	};

	return (
		<Container maxWidth="sm">
			<Paper elevation={3} sx={{ padding: 4, marginTop: 6 }}>
				<Typography variant="h5" gutterBottom>
					Register
				</Typography>
				<Box
					component="form"
					onSubmit={handleSubmit}
					noValidate
					autoComplete="on"
				>
					<TextField
						fullWidth
						label="Name"
						name="name"
						margin="normal"
						value={formData.name}
						onChange={handleChange}
						required
						autoComplete="name"
					/>
					<TextField
						fullWidth
						label="Email"
						name="email"
						type="email"
						margin="normal"
						value={formData.email}
						onChange={handleChange}
						required
						autoComplete="email"
					/>
					<TextField
						fullWidth
						label="Password"
						name="password"
						type="password"
						margin="normal"
						value={formData.password}
						onChange={handleChange}
						required
						autoComplete="new-password"
					/>
					<TextField
						fullWidth
						label="Confirm Password"
						name="confirmPassword"
						type="password"
						margin="normal"
						value={formData.confirmPassword}
						onChange={handleChange}
						required
						autoComplete="new-password"
					/>
					<Stack spacing={2} mt={2}>
						{error && <Alert severity="error">{error}</Alert>}
						{success && <Alert severity="success">{success}</Alert>}
					</Stack>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						sx={{ marginTop: 2 }}
					>
						Register
					</Button>
				</Box>
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

export default RegisterForm;
