import RendererGuild from '@/discord/structures/guild/RendererGuild';

type ServerProps = {
  server: RendererGuild;
};

export default function Server({ server }: ServerProps) {
  return (
    <div className="Server">
      <img className="Server--icon" src={server.getIconUrl()} alt="" />
    </div>
  );
}
