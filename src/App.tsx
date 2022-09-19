import './App.css';
import { ReactComposites } from './components/ReactComposites';

export const App = (): JSX.Element => {
  const userId = '<Azure Communication Services Identifier>';
  const displayName = '<Display Name>';
  const token = '<Azure Communication Services Access Token>';
  // Calling Variables
  // Provide any valid UUID for `groupId`.
  const groupId = '<Developer generated GUID>';
  return (
    <div className="App">
      <ReactComposites userId={userId} displayName={displayName} token={token} groupId={groupId} />
    </div>
  );
}

export default App;
