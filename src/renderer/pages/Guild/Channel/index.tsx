import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Channel.css';
import RendererChannel from '../../../../discord/structures/channel/RendererChannel';
import { IChannelData } from '../../../../discord/structures/channel/BaseChannel';
import { Message } from '../../../../discord/structures/Message';

export default function ChannelPage() {
  const params = useParams();
  const channelId = params.channelId ?? '';
  const [channel, setChannel] = useState<RendererChannel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Live messages
  useEffect(() => {
    window.electron.ipcRenderer.on(
      'discord:gateway:message-create',
      (msg: Message) => {
        if (msg.channel_id !== channelId) return;

        setMessages([msg, ...messages]);
      },
    );
  }, [channel, channelId, messages]);

  // Channel loading / Page loading
  useEffect(() => {
    const loadChannel = () => {
      window.electron.ipcRenderer
        .invoke('discord:load-channel', channelId)
        .then(async (data: IChannelData) => {
          if (data.id !== channelId) return false;

          const chn = new RendererChannel(data);
          const msgs = await chn.fetchMessages();
          setChannel(chn);
          setMessages(msgs);
          return true;
        })
        .catch((err) => console.error(err));
    };

    if (channel !== null) {
      if (channel.id !== channelId) {
        loadChannel();
      }
      return;
    }

    const messageList = document.getElementById('channel_page_message_list');
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }

    loadChannel();
  }, [channel, channelId]);

  if (channelId.length === 0 || channel === null) return null;

  const handleMessageInput = (e: any) => {
    if (e.key !== 'Enter') return;
    const { value } = e.target;

    if (value === '') return;

    channel?.createMessage({
      content: value,
    });
  };

  return (
    <div className="channel_page__container">
      <div className="channel_page__header">
        <h1># {channel.name}</h1>
      </div>
      <div className="channel_page__chat">
        <div
          className="channel_page__messages hidden_scrollbar"
          id="channel_page_message_list"
        >
          {messages.map((message) => {
            const date = new Date(Date.parse(message.timestamp));

            return (
              <div
                className="channel_page__message"
                key={`Message:${message.id}`}
              >
                <div className="channel_page__message_author">
                  <img
                    className="channel_page__message_avatar"
                    src={`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`}
                    alt="Avatar Icon"
                  />
                  {message.author.avatar_decoration_data && (
                    <img
                      className="channel_page__user_decoration"
                      src={`https://cdn.discordapp.com/avatar-decoration-presets/${
                        message.author.avatar_decoration_data.asset
                      }.png`}
                      alt="Avatar Decoration"
                    />
                  )}
                </div>
                <div className="channel_page__message_wrapper">
                  <div className="channel_page__message_author_info">
                    <p className="channel_page__message_author_name">
                      {message.author.global_name}
                    </p>
                    <p className="channel_page__message_timestamp">
                      {date.toLocaleDateString('de-DE', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </p>
                  </div>
                  <p className="channel_page__message_content">
                    {message.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <input
          className="channel_page__message_input"
          type="text"
          onKeyDown={handleMessageInput}
        />
      </div>
    </div>
  );
}
