function OnlineCheckbox({ isOn, toggleCheckbox }) {
  return (
    <div className="online-checkbox flex items-center ml-2">
      <input id="online-checkbox" type="checkbox" />
      <label onClick={toggleCheckbox} htmlFor="online-checkbox">
        {isOn ? "Online" : "All"}
      </label>
    </div>
  );
}

export default OnlineCheckbox;
