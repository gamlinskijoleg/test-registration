import {
	Button,
	Box,
	Typography,
	Paper,
	Stack,
	ImageList,
	ImageListItem,
	CircularProgress,
	Container,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabaseUser from "../../services/auth";
import useProtectedRoute from "../../hooks/useProtectedRoute";
import supabaseTasks from "../../services/tasks";

const Dashboardik = () => {
	useProtectedRoute();
	const navigate = useNavigate();
	const [images, setImages] = useState<string[]>([]);
	const [userId, setUserId] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const handleLogout = async () => {
		await supabaseUser.LogOut();
		navigate("/");
	};

	useEffect(() => {
		const fetchImages = async () => {
			setLoading(true);
			const { data: userData, error: userError } = await supabaseUser.GetUser();

			if (userError || !userData?.user) {
				setLoading(false);
				return;
			}

			const uid = userData.user.id;
			setUserId(uid);

			const { data: photos, error } = await supabaseTasks.getPhotos(uid);
			if (error) {
				console.error("Failed to fetch photos:", error.message);
				setLoading(false);
				return;
			}

			const urls = photos.map((photo) => {
				const res = supabaseTasks.getPublicUrl(photo.path);
				return res.publicUrl;
			});

			setImages(urls);
			setLoading(false);
		};

		fetchImages();
	}, []);

	return (
		<Container maxWidth="md" sx={{ pt: 6, pb: 10 }}>
			<Paper
				elevation={6}
				sx={{
					p: 5,
					borderRadius: 3,
					bgcolor: "#fff",
					mb: 6,
					textAlign: "center",
				}}
			>
				<Typography variant="h4" fontWeight="600" gutterBottom>
					Welcome to your Dashboard
				</Typography>
				<Stack
					direction={{ xs: "column", sm: "row" }}
					spacing={3}
					justifyContent="center"
					alignItems="center"
					mt={2}
				>
					<Button
						component={Link}
						to="/uploadImage"
						variant="contained"
						size="large"
						sx={{ minWidth: 150 }}
					>
						Upload image
					</Button>

					<Button
						component={Link}
						to="/tasks"
						variant="outlined"
						size="large"
						sx={{ minWidth: 150 }}
					>
						Tasks
					</Button>

					<Button
						component={Link}
						to="/changepassword"
						variant="contained"
						size="large"
						color="secondary"
						sx={{ minWidth: 150 }}
					>
						Change Password
					</Button>

					<Button
						variant="outlined"
						size="large"
						onClick={handleLogout}
						color="error"
						sx={{ minWidth: 150 }}
					>
						Log out
					</Button>
				</Stack>
			</Paper>

			{loading && (
				<Box display="flex" justifyContent="center" mt={4}>
					<CircularProgress />
				</Box>
			)}

			{!loading && images.length > 0 && (
				<ImageList variant="masonry" cols={3} gap={10}>
					{images.map((url, index) => (
						<ImageListItem
							key={index}
							sx={{
								borderRadius: 2,
								overflow: "hidden",
								boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
								transition: "transform 0.2s ease-in-out",
								"&:hover": { transform: "scale(1.05)" },
							}}
						>
							<img
								src={url}
								alt={`Uploaded ${index}`}
								loading="lazy"
								style={{ width: "100%", display: "block" }}
							/>
						</ImageListItem>
					))}
				</ImageList>
			)}

			{!loading && images.length === 0 && (
				<Typography
					variant="body1"
					color="text.secondary"
					align="center"
					mt={6}
					fontStyle="italic"
				>
					No images uploaded yet.
				</Typography>
			)}
		</Container>
	);
};

export default Dashboardik;
