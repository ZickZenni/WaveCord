import RendererGuild from '@/discord/structures/guild/RendererGuild';
import { Link } from 'react-router-dom';

type ServerProps = {
  server: RendererGuild;
};

export default function Server({ server }: ServerProps) {
  return (
    <Link to={`/guild/${server.id}`} className="Server">
      <img className="Server--icon" src={server.getIconUrl()} alt="" />
    </Link>
  );
}
