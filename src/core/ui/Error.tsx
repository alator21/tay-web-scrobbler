type ErrorProps = { error: string };
export function Error({ error }: ErrorProps) {

  return (
    <div className="space-y-4">
      <p className="text-red-500 text-center">{error}</p>
      {/* <button */}
      {/*   onClick={handleAuthenticate} */}
      {/*   className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 transition-colors duration-200 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" */}
      {/* > */}
      {/*   Try Again */}
      {/* </button> */}
    </div>);
}
