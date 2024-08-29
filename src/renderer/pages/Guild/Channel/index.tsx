import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Channel, { ChannelMessage } from '../../../../common/discord/channel';
import './Channel.css';

export default function ChannelPage() {
  const params = useParams();
  const channelId = params.channelId ?? '';
  const [channel, setChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<ChannelMessage[]>([]);

  useEffect(() => {
    if (channelId.length === 0) return;

    const messageList = document.getElementById('channel_page_message_list');
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }

    window.electron.ipcRenderer
      .invoke('DISCORD_LOAD_CHANNEL', channelId)
      .then(async (data: Channel | null) => {
        setChannel(data);

        if (data)
          setMessages(
            await window.electron.ipcRenderer.invoke(
              'DISCORD_GET_MESSAGES',
              channelId,
            ),
          );

        return true;
      })
      .catch((err) => console.error(err));

    window.electron.ipcRenderer.sendMessage(
      'DISCORD_SET_LAST_VISITED_GUILD_CHANNEL',
      channelId,
    );
  }, [channelId]);

  if (channelId.length === 0 || channel === null) return null;

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
      </div>
    </div>
  );
}
