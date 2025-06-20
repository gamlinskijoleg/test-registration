import { Outlet, Link, Route, Routes, useNavigate } from "react-router-dom";
import { Box, Button, Typography, Stack } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

const Home = () => {
	const navigate = useNavigate();
	const reset = () => {
		navigate("/");
	};

	return (
		<>
			<Box
				sx={{
					minHeight: "60vh",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					bgcolor: "background.default",
				}}
			>
				<Typography variant="h4" mb={4} color="primary">
					Welcome! Please choose an option:
				</Typography>

				<Stack
					direction={{ xs: "column", sm: "row" }}
					spacing={3}
					justifyContent="center"
					alignItems="center"
					width="100%"
					maxWidth={360}
				>
					<Button
						component={Link}
						to="register"
						variant="contained"
						color="primary"
						size="large"
						startIcon={<AppRegistrationIcon />}
						sx={{
							flexGrow: 1,
							textTransform: "none",
							fontWeight: "bold",
							borderRadius: 3,
							boxShadow: "0 4px 10px rgba(25, 118, 210, 0.3)",
							transition:
								"transform 0.2s ease, box-shadow 0.2s ease",
							"&:hover": {
								transform: "scale(1.05)",
								boxShadow: "0 6px 14px rgba(25, 118, 210, 0.5)",
							},
						}}
					>
						Register
					</Button>

					<Button
						component={Link}
						to="login"
						variant="outlined"
						color="primary"
						size="large"
						startIcon={<LoginIcon />}
						sx={{
							flexGrow: 1,
							textTransform: "none",
							fontWeight: "bold",
							borderRadius: 3,
							borderWidth: 2,
							transition:
								"transform 0.2s ease, box-shadow 0.2s ease",
							"&:hover": {
								transform: "scale(1.05)",
								boxShadow: "0 0 8px rgba(25, 118, 210, 0.6)",
								borderColor: "primary.main",
							},
						}}
					>
						Login
					</Button>
				</Stack>
			</Box>
			<Outlet />
		</>
	);
};

export default Home;
