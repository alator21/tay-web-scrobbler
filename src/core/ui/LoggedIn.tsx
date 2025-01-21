import { Communicator } from "../Communicator";

type LoggedInProps = { communicator: Communicator, reloadStateFn: () => void, user: string };
export function LoggedIn({ communicator, reloadStateFn, user }: LoggedInProps) {

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold">{user.charAt(0).toUpperCase()}</span>
          </div>
          <span className="text-lg font-medium">{user}</span>
        </div>
        <button
          onClick={async () => {
            await communicator.sendTypedMessage({ type: 'LOGOUT' });
            reloadStateFn();
          }}
          className="py-1 px-3 bg-red-600 hover:bg-red-700 transition-colors duration-200 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Logout
        </button>
      </div>
      <div className="space-y-4">
        <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">Song Image</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold truncate">Song Name</h2>
          <p className="text-gray-400 truncate">Artist Name</p>
          <p className="text-gray-500 text-sm truncate">Album Name</p>
        </div>
        <div className="flex justify-center space-x-4">
          <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
