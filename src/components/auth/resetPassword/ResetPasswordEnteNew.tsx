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

const ResetPasswordEnterNew = () => {
	const [password, setPassword] = useState<string>("");
	const [message, setMessage] = useState<string>("");
	const navigate = useNavigate();

	const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { data, error } = await supabaseUser.UpdateUserPassword(password);
		if (error) {
			setMessage(error.message);
		} else {
			setMessage("Verification successful!");
			setTimeout(() => navigate("/dashboard"), 2000);
		}
	};

	return (
		<Container maxWidth="sm">
			<Paper elevation={3} sx={{ mt: 8, p: 4 }}>
				<Typography variant="h5" align="center" gutterBottom>
					Enter new password
				</Typography>

				{message && (
					<Alert
						severity={
							message.includes("successful") ? "success" : "error"
						}
					>
						{message}
					</Alert>
				)}

				<Box component="form" onSubmit={handleVerify} sx={{ mt: 2 }}>
					<TextField
						fullWidth
						label="Password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
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
						Enter new password
					</Button>
				</Box>
			</Paper>
		</Container>
	);
};

export default ResetPasswordEnterNew;
