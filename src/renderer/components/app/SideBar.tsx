import ServerBar from '../server/ServerBar';
import UserBar from './UserBar';

export default function SideBar() {
  return (
    <div className="SideBar">
      <UserBar />
      <ServerBar />
    </div>
  );
}
