import { Message as MessageData } from '@/discord/structures/Message';
import RendererUser from '@/discord/structures/user/RendererUser';
import useGif from '@/hooks/useGif';
import MessageAttachment from './MessageAttachment';

type MessageProps = {
  message: MessageData;
};

export default function Message({ message }: MessageProps) {
  const gif = useGif(message.content);

  const author = new RendererUser(message.author);
  const authorDecorationUrl = author.getAvatarDecorationUrl();

  return (
    <div className="Message">
      <div className="Message--author-container">
        <img
          className="Message--author-img"
          src={author.getAvatarUrl()}
          alt="Author Avatar"
        />
        {authorDecorationUrl !== null && (
          <img
            className="Message--author-decoration-img"
            src={authorDecorationUrl}
            alt="Author Avatar Decoration"
          />
        )}
      </div>
      <div className="Message--content-container">
        <p>{author.globalName}</p>

        {gif !== null ? (
          <img
            className="Message--gif-img"
            src={gif.media_formats.find((v) => v.type === 'gif')?.url}
            alt="Gif"
          />
        ) : (
          <p className="Message--content">{message.content}</p>
        )}

        <div className="Message--attachments-container">
          {message.attachments.map((attachment) => {
            return (
              <MessageAttachment key={attachment.id} attachment={attachment} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
