import { Reaction } from '@/discord/structures/Reaction';
import { grabTheRightIcon } from '@/utils/emojiUtils';

type MessageReactionProps = {
  reaction: Reaction;
};

export default function MessageReaction({ reaction }: MessageReactionProps) {
  const twemojiHash =
    reaction.emoji.id === null ? grabTheRightIcon(reaction.emoji.name) : null;

  const url = twemojiHash
    ? `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/${twemojiHash}.svg`
    : undefined;

  return (
    <div className="MessageReaction">
      <img className="MessageReaction-emoji" src={url} alt="" />
      <p className="MessageReaction-count">{reaction.count}</p>
    </div>
  );
}
