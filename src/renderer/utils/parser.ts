import { User } from '../../common/discord/user';

const MENTION_REGEX = /<@(.*?)>/g;

// eslint-disable-next-line import/prefer-default-export
export async function parseMentions(content: string): Promise<string> {
  const tags = content.match(/<(.*?)>/g);

  // No tags found (<@0123456789012345678> <:Test:0123456789012345678> etc..)
  if (tags === null) return content;

  let newContent = content;

  for (let i = 0; i < tags.length; i += 1) {
    const tag = tags[i];

    const result = MENTION_REGEX.exec(tag);

    // Tag is not a mention
    if (result === null) continue;

    const mentionId = result[1];
    // eslint-disable-next-line no-await-in-loop
    const user: User | null = await window.electron.ipcRenderer
      .invoke('DISCORD_GET_USER', mentionId)
      .catch((err) => window.logger.error(err));

    newContent = newContent.replaceAll(
      `<@${mentionId}>`,
      user ? user.globalName : '<USER_NOT_FOUND>',
    );
  }

  return newContent;
}
