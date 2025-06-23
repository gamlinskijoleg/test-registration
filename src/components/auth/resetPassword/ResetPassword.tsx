import { useState, FormEvent } from "react";
import {
	Container,
	Paper,
	Typography,
	TextField,
	Button,
	Box,
	Alert,
} from "@mui/material";
import supabaseUser from "../../../services/auth";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
	const [email, setEmail] = useState<string>("");
	const [message, setMessage] = useState<string>("");
	const navigate = useNavigate();

	const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const { data, error } = await supabaseUser.resetPasswordForEmail(email);

		if (error) {
			setMessage(error.message);
		} else {
			setMessage("Password reset email sent successfully!");
			navigate("/dashboard");
		}
	};

	return (
		<Container maxWidth="sm">
			<Paper elevation={3} sx={{ mt: 8, p: 4 }}>
				<Typography variant="h5" align="center" gutterBottom>
					Change Password
				</Typography>

				{message && (
					<Alert
						severity={
							message.includes("successfully")
								? "success"
								: "error"
						}
						sx={{ mt: 2 }}
					>
						{message}
					</Alert>
				)}

				<Box
					component="form"
					onSubmit={handleChangePassword}
					sx={{ mt: 2 }}
				>
					<TextField
						fullWidth
						label="Email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						margin="normal"
						required
					/>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						fullWidth
						sx={{ mt: 2 }}
					>
						Update Password
					</Button>
				</Box>
			</Paper>
		</Container>
	);
};

export default ResetPassword;
