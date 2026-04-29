import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SubtaskItem from "./SubtaskItem";

// Helper para reordenar y normalizar order
function reorderSubtasks(list, fromIndex, toIndex) {
  const updated = [...list];
  const [moved] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, moved);

  return updated.map((item, index) => ({
    ...item,
    order: index + 1,
  }));
}

function SortableItem({
  subtask,
  onItemChange,
  schemaOnly,
  handleDelete,
  handleEdit,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: subtask._id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 bg-base-100/40 rounded-md transition-colors"
    >
      {/* Drag handle */}
      <button {...attributes} {...listeners} className="cursor-grab px-2">
        <FontAwesomeIcon icon={faGripVertical} />
      </button>

      <div className="flex-1">
        <SubtaskItem
          subtask={subtask}
          onChange={onItemChange}
          schemaOnly={schemaOnly}
        />
      </div>
      {schemaOnly && handleDelete && (
        <button
          className="btn btn-sm btn-error"
          onClick={() => handleDelete(subtask._id)}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      )}
    </div>
  );
}

export default function SubtasksSection({ subtasks, setSubtasks, schemaOnly }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  // Cambios de un item individual
  function handleItemChange(id, patch) {
    setSubtasks((prev) =>
      prev.map((st) => (st._id === id ? { ...st, ...patch } : st)),
    );
  }

  // Drag & drop
  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setSubtasks((prev) => {
      const oldIndex = prev.findIndex((s) => s._id.toString() === active.id);
      const newIndex = prev.findIndex((s) => s._id.toString() === over.id);

      return reorderSubtasks(prev, oldIndex, newIndex);
    });
  }

  function handleDelete(id) {
    setSubtasks((prev) => prev.filter((s) => s._id !== id));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={subtasks.map((s) => s._id.toString())}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {subtasks.map((st) => (
            <SortableItem
              key={st._id}
              subtask={st}
              onItemChange={handleItemChange}
              schemaOnly={schemaOnly}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
