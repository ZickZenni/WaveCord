import DiscordIcon from '@/assets/app/icons/discord.svg';
import { Link } from 'react-router-dom';

export default function UserBar() {
  return (
    <div className="UserBar">
      <Link to="/" className="Server" style={{ borderRadius: '50%' }}>
        <img className="UserBar--discord" src={DiscordIcon} alt="" />
      </Link>
      <div className="SideBar--separator" />
    </div>
  );
}
