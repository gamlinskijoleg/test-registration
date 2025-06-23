import {
	Button,
	Box,
	Typography,
	Paper,
	Stack,
	ImageList,
	ImageListItem,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import useProtectedRoute from "../hooks/useProtectedRoute";

const Dashboardik = () => {
	useProtectedRoute();

	const navigate = useNavigate();
	const [images, setImages] = useState([]);
	const [userId, setUserId] = useState(null);

	const handleLogout = async () => {
		await supabase.auth.signOut();
		navigate("/");
	};

	useEffect(() => {
		const fetchImages = async () => {
			const { data: userData, error: userError } =
				await supabase.auth.getUser();
			if (userError || !userData?.user) return;

			const uid = userData.user.id;
			setUserId(uid);

			const { data: photos, error } = await supabase
				.from("photos")
				.select("path")
				.eq("user_id", uid);

			if (error) {
				console.error("Failed to fetch photos:", error.message);
				return;
			}

			const urls = photos.map((photo) => {
				const { data } = supabase.storage
					.from("photos")
					.getPublicUrl(photo.path);
				return data.publicUrl;
			});

			setImages(urls);
		};

		fetchImages();
	}, []);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				minHeight: "100vh",
				bgcolor: "#f9f9f9",
				p: 4,
			}}
		>
			<Paper
				elevation={6}
				sx={{
					padding: 5,
					borderRadius: 4,
					width: "100%",
					maxWidth: 600,
					textAlign: "center",
					backgroundColor: "#ffffff",
					mb: 4,
				}}
			>
				<Typography variant="h5" gutterBottom>
					Welcome to your Dashboard
				</Typography>

				<Stack spacing={2} mt={2}>
					<Button
						component={Link}
						to="/uploadImage"
						variant="contained"
					>
						Upload image
					</Button>

					<Button component={Link} to="/tasks" variant="outlined">
						Tasks
					</Button>
					<Button
						component={Link}
						to="/changepassword"
						variant="contained"
					>
						Change Password
					</Button>

					<Button variant="outlined" onClick={handleLogout}>
						Log out
					</Button>
				</Stack>
			</Paper>

			{images.length > 0 ? (
				<ImageList variant="masonry" cols={3} gap={8}>
					{images.map((url, index) => (
						<ImageListItem key={index}>
							<img
								src={url}
								alt={`Uploaded ${index}`}
								loading="lazy"
								style={{ borderRadius: "12px" }}
							/>
						</ImageListItem>
					))}
				</ImageList>
			) : (
				<Typography variant="body1" color="text.secondary">
					No images uploaded yet.
				</Typography>
			)}
		</Box>
	);
};

export default Dashboardik;
