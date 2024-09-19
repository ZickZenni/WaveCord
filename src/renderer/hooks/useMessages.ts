import RendererChannel from '@/discord/structures/channel/RendererChannel';
import { Message } from '@/discord/structures/Message';
import { useEffect, useState } from 'react';

export default function useMessages(channel: RendererChannel | null) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (channel) {
      channel
        .fetchMessages()
        .then((data: Message[]) => {
          setMessages(data);
          return true;
        })
        .catch((err) => console.error(err));
    }

    const subscription = window.electron.ipcRenderer.on(
      'discord:gateway:message-create',
      (message: Message) => {
        if (message.channel_id !== channel?.id) return;

        setMessages((old) => [message, ...old]);
      },
    );

    return () => {
      window.electron.ipcRenderer.removeListener(subscription);
    };
  }, [channel]);

  return messages;
}
