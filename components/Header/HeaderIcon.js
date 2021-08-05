export default function HeaderIcon({ Icon, active, onClickHandler }) {
  const textColor = active
    ? "text-blue-700"
    : "text-gray-500 hover:text-blue-700";
  const backgroundColor = active ? "bg-gray-300" : "hover:bg-gray-300";
  return (
    <div
      className={`cursor-pointer ${textColor} ${backgroundColor}  p-[5px] md:p-2 rounded-xl  transition-all `}
    >
      <Icon className="h-[20px] md:h-6" onClick={onClickHandler} />
    </div>
  );
}
