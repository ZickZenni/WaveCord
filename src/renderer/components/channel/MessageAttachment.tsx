import { Attachment } from '@/discord/structures/Attachment';

type MessageAttachmentProps = {
  attachment: Attachment;
};

function ImageAttachment({ attachment }: MessageAttachmentProps) {
  return (
    <div className="MessageAttachment">
      <img
        className="MessageAttachment--image"
        src={attachment.url}
        alt={`Attachment:${attachment.filename}`}
      />
    </div>
  );
}

export default function MessageAttachment({
  attachment,
}: MessageAttachmentProps) {
  if (attachment.content_type.startsWith('image'))
    return <ImageAttachment attachment={attachment} />;

  return null;
}
