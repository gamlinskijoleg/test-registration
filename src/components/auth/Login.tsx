import {
	Box,
	Button,
	Container,
	TextField,
	Typography,
	Paper,
	Alert,
	CircularProgress,
	Stack,
} from "@mui/material";
import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import supabaseUser from "../../services/auth";

const Login = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState<{
		email: string;
		password: string;
	}>({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setError("");
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!formData.email.trim() || !formData.password.trim()) {
			setError("Please enter both email and password.");
			return;
		}

		setLoading(true);
		setError("");

		const { data, error } = await supabaseUser.Login(
			formData.email,
			formData.password
		);

		setLoading(false);

		if (error) {
			setError(error.message || "Failed to login. Please try again.");
			return;
		}

		if (data?.user) {
			navigate("/dashboard");
		}
	};

	const handleForgotPassword = () => {
		navigate("/resetPassword");
	};

	return (
		<Container
			maxWidth="xs"
			sx={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				p: 3,
			}}
		>
			<Paper elevation={6} sx={{ p: 4, width: "100%", borderRadius: 3 }}>
				<Typography variant="h5" align="center" mb={3} fontWeight="600">
					Login to Upload Pictures
				</Typography>

				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				<Box
					component="form"
					onSubmit={handleSubmit}
					noValidate
					autoComplete="on"
				>
					<TextField
						fullWidth
						label="Email Address"
						name="email"
						type="email"
						autoComplete="email"
						value={formData.email}
						onChange={handleChange}
						margin="normal"
						autoFocus
						required
					/>
					<TextField
						fullWidth
						label="Password"
						type="password"
						name="password"
						autoComplete="current-password"
						value={formData.password}
						onChange={handleChange}
						margin="normal"
						required
						inputProps={{ minLength: 6 }}
					/>

					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="center"
						mt={1}
						mb={3}
					>
						<Button
							variant="text"
							color="primary"
							onClick={handleForgotPassword}
							size="small"
							sx={{ textTransform: "none" }}
						>
							Forgot password?
						</Button>
					</Stack>

					<Button
						type="submit"
						variant="contained"
						fullWidth
						disabled={loading}
						sx={{ py: 1.5, fontWeight: "bold" }}
					>
						{loading ? (
							<CircularProgress size={24} color="inherit" />
						) : (
							"Log In"
						)}
					</Button>
				</Box>
			</Paper>

			<Button
				component={Link}
				to="/"
				variant="text"
				sx={{ mt: 3, alignSelf: "center", textTransform: "none" }}
			>
				Back to Home
			</Button>
		</Container>
	);
};

export default Login;
