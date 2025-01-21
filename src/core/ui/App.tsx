import { useEffect, useState } from 'react'
import './App.css'
import { Communicator } from '../Communicator';
import { LoggedOut } from './LoggedOut';
import { LoggedIn } from './LoggedIn';
import { Loading } from './Loading';
import { Error } from './Error';

type AppProps = {
  communicator: Communicator
};
export function App({ communicator }: AppProps) {
  console.log(import.meta.env);
  const [state, setState] = useState<{ status: 'loading' }
    | { status: 'loggedIn'; user: string }
    | { status: 'loggedOut' }
    | { status: 'error'; error: string }>({ status: 'loading' });
  useEffect(() => {
    reloadState();
  }, [])

  async function reloadState() {
    const response = await communicator.sendTypedMessage({ type: 'GET_LAST_FM_AUTH_STATUS' });
    console.log({ response });
    const { success } = response;
    if (!success) {
      setState({ status: 'error', error: response.error });
      return;
    }
    const { data } = response;
    console.log({ data });
    if (data === undefined) {
      setState({ status: 'loggedOut' });
      return;
    }
    setState({ status: 'loggedIn', user: data.user });
  }

  return (
    <>

      <div className="w-80 p-6 bg-gray-900 text-white shadow-lg">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-center">Tay Web Scrobbler</h1>
          {state.status === 'error' && <Error error={state.error} />}
          {state.status === 'loading' && <Loading />}
          {state.status === 'loggedIn' && <LoggedIn communicator={communicator} reloadStateFn={reloadState} user={state.user} />}
          {state.status === 'loggedOut' && <LoggedOut communicator={communicator} reloadStateFn={reloadState} />}
        </div>
      </div>
    </>
  )
}

