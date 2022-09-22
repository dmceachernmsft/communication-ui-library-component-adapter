import './App.css';
import { ReactComposites } from './components/ReactComposites';
import {v1 as generateGUID} from 'uuid';
import { ReactComponents } from './components/ReactComponents';

export const App = (): JSX.Element => {
  // token and user id for composites
  const userId1 = '8:acs:b6aada1f-0b1d-47ac-866f-91aae00a1d01_00000014-00be-32c4-9ffb-9c3a0d0085eb';
  const token1 = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwNiIsIng1dCI6Im9QMWFxQnlfR3hZU3pSaXhuQ25zdE5PU2p2cyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOmI2YWFkYTFmLTBiMWQtNDdhYy04NjZmLTkxYWFlMDBhMWQwMV8wMDAwMDAxNC0wMGJlLTMyYzQtOWZmYi05YzNhMGQwMDg1ZWIiLCJzY3AiOjE3OTIsImNzaSI6IjE2NjM3Nzc0MTAiLCJleHAiOjE2NjM4NjM4MTAsImFjc1Njb3BlIjoidm9pcCIsInJlc291cmNlSWQiOiJiNmFhZGExZi0wYjFkLTQ3YWMtODY2Zi05MWFhZTAwYTFkMDEiLCJpYXQiOjE2NjM3Nzc0MTB9.e9xV7mjxv4nvKwqUjP6X1EGO1Xi0L9VnRz928f_XcBGX_m9_Do-qPG40xdtLX_rcRTSnBbUAXJsNZVjzBkp-JcRpMovLqrAAyCm8dcYk9soYT4PLc3otckIJhGHeDTJRhP5Pxfkegl04y9wQRfRFiEJteVUPiPlN1WhDbE4YxYcVUFqrTa8ie59sJqJEaepXvltewOpzREx6IhZP7cC5RW40JSEVkMyc1Vk62IrzfizblXOS5H74ZW89rbhLS9EZawIzWG16WEwBfzF2anjdKu6zKj6X1XcgrS2VeIAl_UZ1Rnyc7gSDa6AB26gAQgYawd_Dhj7zJmHwjqZuObTczQ';

  // token and user id for component app
  const userId2 = '8:acs:b6aada1f-0b1d-47ac-866f-91aae00a1d01_00000014-00be-2565-b4f1-9c3a0d00961f';
  const token2 = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwNiIsIng1dCI6Im9QMWFxQnlfR3hZU3pSaXhuQ25zdE5PU2p2cyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOmI2YWFkYTFmLTBiMWQtNDdhYy04NjZmLTkxYWFlMDBhMWQwMV8wMDAwMDAxNC0wMGJlLTI1NjUtYjRmMS05YzNhMGQwMDk2MWYiLCJzY3AiOjE3OTIsImNzaSI6IjE2NjM3Nzc0MDciLCJleHAiOjE2NjM4NjM4MDcsImFjc1Njb3BlIjoidm9pcCIsInJlc291cmNlSWQiOiJiNmFhZGExZi0wYjFkLTQ3YWMtODY2Zi05MWFhZTAwYTFkMDEiLCJpYXQiOjE2NjM3Nzc0MDd9.S0G-BfpjlMEeEu7VeYrfd79TqFLTAn9IC87dRNnDqByZPfgpzElx8A4OlKEG7QIfyWAwRKZ-CNLXYIdMepKf_tEUWy-CwgCV4ROqCMkBWcy8P7TDlR6vpPaFUYqB7MklboJLbIcjteQhevjgJrg-CXYrnhs_5_i-_4Ndaj83gZaoerMGXzZndadFZoTubVrpcCzqO_hJSvy-yy1v4PxRqvSNqYrQtwy7y8Aa4VNnBianUv8NCXOGbNviFe7pnMJpHoLGYnmRZV6xX07UMtIl1mFJ_ydrKcyZDyrBiqfgfYT3Nb8i_18c_JrUOvrVJDyX16AeJJvmeqeBsJKjT7HOiA';
  // Calling Variables
  // Provide any valid UUID for `groupId`.
  const displayName = 'd';
  const groupId = generateGUID();
  return (
    <div className="App">
      <ReactComposites userId={userId1} displayName={displayName} token={token1} groupId={groupId} />
      <ReactComponents userId={userId2} displayName={displayName} token={token2} groupId={groupId} />
    </div>
  );
}

export default App;
