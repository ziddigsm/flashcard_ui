import "./Warning.css";

export default function Warning({ message, onClose, onConfirm }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3 className="modal-title">Confirm the Action</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="button-no" onClick={onClose}>
            No
          </button>
          <button className="button-yes" onClick={onConfirm}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
