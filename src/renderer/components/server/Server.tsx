import RendererGuild from '@/discord/structures/guild/RendererGuild';

type ServerProps = {
  server: RendererGuild;
};

export default function Server({ server }: ServerProps) {
  return <div>
    <img src={server.getIconUrl()} alt="" />
    </div>
  );
}
