export default function CardStats({
  statSubtitle,
  statTitle,
  statArrow,
  statPercent,
  statPercentColor,
  statDescripiron,
  statIconName,
  statIconColor,
}) {
  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white rounded-xl shadow-md p-5">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <h5 className="text-slate-400 uppercase text-xs font-semibold tracking-wide">
            {statSubtitle}
          </h5>
          <span className="block mt-1 text-2xl font-bold text-slate-800">
            {statTitle}
          </span>
        </div>
        <div className="ml-4 flex-shrink-0">
          <div
            className={
              "inline-flex items-center justify-center w-12 h-12 text-white p-3 rounded-xl shadow-md " +
              statIconColor
            }
          >
            {statIconName}
          </div>
        </div>
      </div>
      {(statPercent || statDescripiron) && (
        <p className="text-sm text-slate-400 mt-3">
          <span className={statPercentColor + " mr-2"}>
            <i
              className={
                statArrow === "up"
                  ? "fas fa-arrow-up"
                  : statArrow === "down"
                  ? "fas fa-arrow-down"
                  : ""
              }
            ></i>{" "}
            {statPercent}
          </span>
          <span className="whitespace-nowrap">{statDescripiron}</span>
        </p>
      )}
    </div>
  );
}
