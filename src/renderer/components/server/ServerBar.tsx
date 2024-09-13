// Hooks
import useGuilds from '@/hooks/useGuilds';

// Components
import Server from './Server';

export default function ServerBar() {
  const guilds = useGuilds();

  return (
    <div className="ServerBar hidden-scrollbar">
      {guilds.map((guild) => {
        return <Server server={guild} />;
      })}
    </div>
  );
}
