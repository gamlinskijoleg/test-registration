import { useDraggable } from "@dnd-kit/core";
import { Paper, Box, Typography, Tooltip, IconButton } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { CSSProperties, MouseEvent } from "react";

interface TaskCardProps {
	id: string;
	title: string;
	onRightClick?: () => void;
	onDelete?: () => void;
}

export default function TaskCard({
	id,
	title,
	onRightClick,
	onDelete,
}: TaskCardProps) {
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({ id });

	const style: CSSProperties = {
		transform: transform
			? `translate3d(${transform.x}px, ${transform.y}px, 0)`
			: undefined,
		opacity: isDragging ? 0.5 : 1,
		cursor: "grab",
		userSelect: "none",
	};

	const handleContextMenu = (event: MouseEvent) => {
		event.preventDefault();
		if (onRightClick) onRightClick();
	};

	return (
		<Paper
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			onContextMenu={handleContextMenu}
			sx={{
				p: 2,
				mb: 2,
				borderRadius: 2,
				boxShadow: 2,
				backgroundColor: "#fff",
				":hover": { backgroundColor: "#f9f9f9" },
			}}
		>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
			>
				<Typography fontWeight={500} sx={{ pr: 1 }}>
					{title}
				</Typography>

				<Box display="flex" alignItems="center" gap={1}>
					<Tooltip title="Right click to edit">
						<InfoOutlinedIcon fontSize="small" color="action" />
					</Tooltip>
					<Tooltip title="Delete task">
						<IconButton size="small" onClick={onDelete}>
							<DeleteForeverIcon fontSize="small" color="error" />
						</IconButton>
					</Tooltip>
				</Box>
			</Box>
		</Paper>
	);
}
