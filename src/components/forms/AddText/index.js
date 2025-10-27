import { useState } from "react";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function AddTextForm(props) {
  const { user, select, close } = props;
  const [text, setText] = useState("");
  const today = new Date();

  function handleChange(e) {
    setText(e.target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    select(`(${today.toLocaleDateString()} ${user}) ${text}`);
    setText("");
    close();
  }

  return (
    <div className="flex w-full items-center gap-1">
      <textarea
        value={text}
        className="textarea textarea-bordered resize-none bg-base-content/10 py-0 flex-grow"
        onChange={handleChange}
      />
      <div className="flex flex-col">
        <button
          className="btn btn-xs btn-secondary btn-outline ml-auto w-full"
          onClick={close}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <button className="btn btn-sm btn-primary" onClick={handleSubmit}>
          <FontAwesomeIcon icon={faPaperPlane} className="md:hidden" />
          <span className="hidden md:inline">Guardar</span>
        </button>
      </div>
    </div>
  );
}
