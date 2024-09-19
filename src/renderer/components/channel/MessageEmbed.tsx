import { Embed } from '@/discord/structures/Embed';

type MessageEmbedProps = {
  embed: Embed;
};

export default function MessageEmbed({ embed }: MessageEmbedProps) {
  return (
    <div className="MessageEmbed">
      {embed.title && <p className="MessageEmbed--title">{embed.title}</p>}
      {embed.description && (
        <p className="MessageEmbed--description">{embed.description}</p>
      )}
      {embed.thumbnail && (
        <img
          src={embed.thumbnail.url}
          className="MessageEmbed--thumbnail-img"
          alt={embed.thumbnail.url}
        />
      )}
    </div>
  );
}
