import './App.css';
import { ReactComposites } from './components/ReactComposites';
import {v1 as generateGUID} from 'uuid';
import { ReactComponents } from './components/ReactComponents';

export const App = (): JSX.Element => {
  // token and user id for composites
  const userId1 = '<User Id associated to the token>';
  const token1 = '<Azure Communication Services Resource Access Token>';

  // token and user id for component app
  const userId2 = '<User Id associated to the token>';
  const token2 = '<Azure Communication Services Resource Access Token>';
  // Calling Variables
  // Provide any valid UUID for `groupId`.
  const displayName = '<Display Name>';
  const groupId = generateGUID();
  return (
    <div className="App">
      <ReactComposites userId={userId1} displayName={displayName} token={token1} groupId={groupId} />
      <ReactComponents userId={userId2} displayName={displayName} token={token2} groupId={groupId}/>
    </div>
  );
}

export default App;
