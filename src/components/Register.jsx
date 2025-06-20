import React, { useState } from "react";
import {
	TextField,
	Button,
	Container,
	Typography,
	Box,
	Paper,
} from "@mui/material";

import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

const RegisterForm = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const isCorrectUser = () => {
		const { name, email, password, confirmPassword } = formData;

		if (
			password.length >= 6 &&
			password === confirmPassword &&
			name &&
			email
		) {
			return true;
		}
		return false;
	};

	const handleSubmit = async (e) => {
		const { name, email, password, confirmPassword } = formData;
		e.preventDefault();

		if (!isCorrectUser()) {
			alert("review ur input");
			return;
		}

		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
		});

		if (error) {
			console.error("Signup error:", error);
		
		} else {
			alert("confirmation link sent!")
		}
		// navigate("/dashboard");
	};

	return (
		<Container maxWidth="sm">
			<Paper elevation={3} style={{ padding: 30, marginTop: 50 }}>
				<Typography variant="h5" gutterBottom>
					Register
				</Typography>
				<Box component="form" onSubmit={handleSubmit} noValidate>
					<TextField
						fullWidth
						label="Name"
						name="name"
						margin="normal"
						value={formData.name}
						onChange={handleChange}
						required
					/>
					<TextField
						fullWidth
						label="Email"
						name="email"
						type="email"
						margin="normal"
						value={formData.surname}
						onChange={handleChange}
						required
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
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						onClick={handleSubmit}
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
