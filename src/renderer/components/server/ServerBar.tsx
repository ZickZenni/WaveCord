import useGuilds from '@/hooks/useGuilds';
import Server from './Server';

export default function ServerBar() {
  const guilds = useGuilds();

  return (
    <div className="ServerBar">
      {guilds.map((guild) => {
        return <Server server={guild} />;
      })}
    </div>
  );
}
