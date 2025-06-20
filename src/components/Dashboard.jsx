import { Button, Box, Typography, Paper, Stack } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import useProtectedRoute from "../hooks/useProtectedRoute";

const Dashboardik = () => {
	useProtectedRoute();

	const navigate = useNavigate();

	const [userName, setUserName] = useState("");

	const handleLogout = async () => {
		await supabase.auth.signOut();
		navigate("/");
	};

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "100vh",
			}}
		>
			<Paper
				elevation={6}
				sx={{
					padding: 5,
					borderRadius: 4,
					width: 400,
					textAlign: "center",
					backgroundColor: "#ffffff",
				}}
			>
				<Typography variant="h4" gutterBottom>
					Welcome,
				</Typography>
				<Typography variant="h5" color="primary" gutterBottom>
					{userName}
				</Typography>

				<Stack spacing={2} mt={4}>
					<Button
						variant="contained"
						component={Link}
						to="/changepassword"
					>
						Change Password
					</Button>

					<Button variant="outlined" onClick={handleLogout}>
						Log out
					</Button>
				</Stack>
			</Paper>
		</Box>
	);
};

export default Dashboardik;
