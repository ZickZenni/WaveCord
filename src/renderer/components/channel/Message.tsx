import { Message as MessageData } from '@/discord/structures/Message';
import RendererUser from '@/discord/structures/user/RendererUser';

type MessageProps = {
  message: MessageData;
};

export default function Message({ message }: MessageProps) {
  const author = new RendererUser(message.author);

  return (
    <div className="Message">
      <div className="Message--author-container">
        <img
          className="Message--author-img"
          src={author.getAvatarUrl()}
          alt="Author Avatar"
        />
        <p>{author.globalName}</p>
      </div>
      <p className="Message--content">{message.content}</p>
    </div>
  );
}
