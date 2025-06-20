import {
	Box,
	Button,
	Container,
	TextField,
	Typography,
	Paper,
} from "@mui/material";
import { useContext, useState } from "react";
import bcrypt from "bcryptjs";
import { supabase } from "../supabaseClient";
import { useNavigate, Link, redirect } from "react-router-dom";

const Login = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const { data, error } = await supabase.auth.signInWithPassword({
			email: formData.email,
			password: formData.password,
		});

		if (data) {
			navigate("/dashboard");
		}
	};

	const handleForgotPassword = async () => {
		navigate("/resetPassword")
	};
	return (
		<Container maxWidth="sm">
			<Paper elevation={3} sx={{ mt: 8, p: 4 }}>
				<Typography variant="h4" align="center" gutterBottom>
					Login
				</Typography>
				<Box component="form" onSubmit={handleSubmit}>
					<TextField
						fullWidth
						label="Email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						margin="normal"
					/>
					<TextField
						fullWidth
						label="Password"
						type="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						margin="normal"
					/>
					<Button
						fullWidth
						color="primary"
						onClick={handleForgotPassword}
						sx={{ mt: 2 }}
					>
						Forgot password
					</Button>
					<Button
						fullWidth
						variant="contained"
						type="submit"
						color="primary"
						sx={{ mt: 2 }}
					>
						Submit
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

export default Login;
