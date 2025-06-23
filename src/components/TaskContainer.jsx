import { useDroppable } from "@dnd-kit/core";

export default function TaskContainer({ id, children }) {
	const { isOver, setNodeRef } = useDroppable({ id });

	return (
		<div
			ref={setNodeRef}
			id={id}
			style={{
				minHeight: "240px",
				pointerEvents: "auto",
				backgroundColor: isOver ? "#e0f7fa" : undefined,
			}}
		>
			{children}
		</div>
	);
}


