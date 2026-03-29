import ModalBase from "../../../Modals/ModalBase";
import { TechTaskTemplates } from "../../Admin/Options/TechTaskTemplate/TechTaskTemplates";

export default function TemplateModal({ open, onClose, onSelect }) {
  function handleSelect(template) {
    onSelect(template);
    onClose();
  }

  return (
    <ModalBase
      open={open}
      title="Seleccionar tarea"
      onClose={onClose}
      className="w-11/12 sm:max-w-[56rem!important]"
    >
      <TechTaskTemplates handleSelect={handleSelect} />
    </ModalBase>
  );
}
