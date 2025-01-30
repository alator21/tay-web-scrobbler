import { format } from "date-fns";
import build from "../../BUILD.json";

export function Version() {
  const VERSION = build.version;
  const BUILD_DATE = format(new Date(build.build_date), "yyyy-MM-dd");
  return (
    <div className="mt-4 text-center text-xs text-gray-500">
      <p>Version: {VERSION}</p>
      <p>Build Date: {BUILD_DATE}</p>
    </div>
  );
}
