import RendererGuild from '@/discord/structures/guild/RendererGuild';

type ServerInfoProps = {
  guild: RendererGuild;
};

export default function ServerInfo({ guild }: ServerInfoProps) {
  return (
    <div className="ServerInfo">
      <img
        className="ServerInfo--banner-img"
        src={guild.getBannerUrl()}
        alt={`${guild.name}'s Banner`}
      />
      <p className="ServerInfo--guild-name">{guild.name}</p>
    </div>
  );
}
