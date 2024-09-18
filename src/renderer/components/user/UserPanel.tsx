import useUser from '@/hooks/useUser';

export default function UserPanel() {
  const user = useUser(undefined);

  console.log('User:', user);

  return (
    <div className="UserPanel">
      <div className="UserPanel--user-container">
        <div className="UserPanel--user-avatar-container">
          <img
            className="UserPanel--user-avatar"
            src={user?.getAvatarUrl(true)}
            alt=""
          />
          <div className="UserPanel--status-icon-wrapper">
            <div className="UserPanel--status-icon UserPanel--status-icon-online " />
          </div>
        </div>
        <div className="UserPanel--user-info-container">
          <p className="UserPanel--user-name">{user?.globalName}</p>
          <p className="UserPanel--user-status">online</p>
        </div>
      </div>
    </div>
  );
}
