import { useState, useRef, useEffect } from "react";
import {
	Button,
	Container,
	Typography,
	Box,
	LinearProgress,
	Alert,
	Paper,
	Grid,
	Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import useProtectedRoute from "../hooks/useProtectedRoute";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const UploadImage = () => {
	useProtectedRoute();
	const navigate = useNavigate();
	const [uploading, setUploading] = useState(false);
	const [messages, setMessages] = useState([]);
	const [errors, setErrors] = useState([]);
	const [userId, setUserId] = useState(null);
	const fileInputRef = useRef(null);

	useEffect(() => {
		const fetchUser = async () => {
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();
			if (error || !user) return;
			setUserId(user.id);
		};
		fetchUser();
	}, []);

	const handleFileChange = async (event) => {
		const files = Array.from(event.target.files);
		if (files.length === 0 || !userId) return;

		setUploading(true);
		setMessages([]);
		setErrors([]);

		const newPreviews = [];
		const newMessages = [];
		const newErrors = [];

		for (const file of files) {
			const fileName = file.name;
			const filePath = `user-${userId}/${fileName}`;

			const { data: uploadData, error: uploadError } =
				await supabase.storage.from("photos").upload(filePath, file);

			if (uploadError) {
				newErrors.push(
					`⚠️ ${file.name}: UPLOAD ERROR, ${uploadError.message}`
				);
			}

			const { error: insertError } = await supabase
				.from("photos")
				.insert({
					user_id: userId,
					path: filePath,
				});

			if (insertError) {
				newErrors.push(
					`⚠️ ${file.name}: Saved to storage but DB insert failed.`
				);
				continue;
			}

			const { data: publicUrlData } = supabase.storage
				.from("photos")
				.getPublicUrl(filePath);

			if (publicUrlData?.publicUrl) {
				newPreviews.push(publicUrlData.publicUrl);
				newMessages.push(`✅ ${file.name} uploaded.`);
			}
		}

		setMessages(newMessages);
		setErrors(newErrors);
		setUploading(false);
	};

	return (
		<Container maxWidth="md">
			<Paper elevation={3} sx={{ p: 4, mt: 6, textAlign: "center" }}>
				<Typography variant="h5" mb={3}>
					Upload Images
				</Typography>

				<input
					type="file"
					accept="image/*"
					multiple
					hidden
					ref={fileInputRef}
					onChange={handleFileChange}
				/>

				<Button
					variant="contained"
					startIcon={<CloudUploadIcon />}
					onClick={() => fileInputRef.current?.click()}
					disabled={uploading || !userId}
					fullWidth
					sx={{
						marginBottom: 2,
					}}
				>
					{uploading ? "Uploading..." : "Select Images"}
				</Button>

				{uploading && <LinearProgress sx={{ mt: 2 }} />}

				{messages.length > 0 && (
					<Box mt={3}>
						{messages.map((msg, index) => (
							<Alert
								key={index}
								severity="success"
								sx={{ mb: 1 }}
							>
								{msg}
							</Alert>
						))}
					</Box>
				)}

				{errors.length > 0 && (
					<Box mt={3}>
						{errors.map((err, index) => (
							<Alert key={index} severity="error" sx={{ mb: 1 }}>
								{err}
							</Alert>
						))}
					</Box>
				)}
				<Button
					variant="outlined"
					startIcon={<CloudUploadIcon />}
					onClick={() => {
						navigate("/dashboard");
					}}
					disabled={uploading || !userId}
					fullWidth
				>
					Назад
				</Button>
			</Paper>
		</Container>
	);
};

export default UploadImage;
