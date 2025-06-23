import { useDraggable } from "@dnd-kit/core";
import { ListItem, ListItemText } from "@mui/material";

export default function TaskCard({ id, title, onRightClick }) {
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({
			id,
		});

	const style = {
		padding: "8px",
		marginBottom: "8px",
		backgroundColor: isDragging ? "#ccc" : "#fff",
		border: "1px solid #ddd",
		borderRadius: "4px",
		cursor: "grab",
		transform: transform
			? `translate3d(${transform.x}px, ${transform.y}px, 0)`
			: undefined,
		userSelect: "none",
	};

	const handleContextMenu = (event) => {
		event.preventDefault();
		if (onRightClick) {
			onRightClick();
		}
	};

	return (
		<ListItem
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			onContextMenu={handleContextMenu}
		>
			<ListItemText primary={title} />
		</ListItem>
	);
}
