import './checkbox.css'; // Import your CSS styles for the checkbox

function Checkbox({ checked, onChange }) {
    return (
        <label className="custom-checkbox">
            <input type="checkbox" checked={checked} onChange={onChange} />
            <span className="checkbox-icon"></span>
        </label>
    );
}

export default Checkbox;