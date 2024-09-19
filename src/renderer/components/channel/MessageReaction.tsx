import { Reaction } from '@/discord/structures/Reaction';
import { Snowflake } from '@/discord/structures/Snowflake';
import { grabTheRightIcon } from '@/utils/emojiUtils';
import { useEffect, useState } from 'react';

type MessageReactionProps = {
  messageId: Snowflake;
  reaction: Reaction;
};

export default function MessageReaction({
  messageId,
  reaction,
}: MessageReactionProps) {
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [color, setColor] = useState<string>('rgb(22,22,22)');
  const [borderColor, setBorderColor] = useState<string>('rgb(22,22,22)');

  useEffect(() => {
    const newId =
      Number(reaction.emoji.id) + Number(messageId) / (256 * 256 * 256);
    const str = newId.toString();

    const r = Number(str.slice(0, 3)) % 255;
    const g = Number(str.slice(4, 7)) % 255;
    const b = Number(str.slice(8, 11)) % 255;

    setColor(`rgb(${r},${g},${b})`);
    setBorderColor(`rgb(${r * 0.7},${g * 0.7},${b * 0.7})`);

    if (reaction.emoji.id === null) {
      setUrl(
        `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/${grabTheRightIcon(reaction.emoji.name)}.svg`,
      );
      return;
    }

    setUrl(
      `https://cdn.discordapp.com/emojis/${reaction.emoji.id}.${reaction.emoji.animated ? 'gif' : 'png'}`,
    );
  }, [messageId, reaction]);

  return (
    <div
      className={`MessageReaction ${reaction.me && 'MessageReaction--clicked'}`}
      style={{ background: color, borderColor }}
      role="presentation"
    >
      <img className="MessageReaction--emoji" src={url} alt="" />
      <p className="MessageReaction--count">{reaction.count}</p>
    </div>
  );
}
