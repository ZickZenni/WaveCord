/* eslint-disable import/prefer-default-export */

import RendererChannel from '../../discord/structures/channel/RendererChannel';

export function sortChannels(channels: RendererChannel[]): RendererChannel[] {
  let pairs: {
    category: RendererChannel | null;
    channels: RendererChannel[];
  }[] = [
    {
      category: null,
      channels: [],
    },
  ];
  const waitLine: RendererChannel[] = [];

  // Loop through all channels
  for (let i = 0; i < channels.length; i += 1) {
    const c = channels[i];
    if (c.parentId === null) {
      if (c.type !== 4) {
        pairs[0].channels.push(c);
      } else
        pairs.push({
          category: c,
          channels: [],
        });
      continue;
    }
    const category = pairs.find(
      (v) => v.category && v.category.id === c.parentId,
    );

    if (category === undefined) {
      waitLine.push(c);
      continue;
    }

    category.channels.push(c);
  }

  // Add channels that are waiting to their respective category
  for (let i = 0; i < waitLine.length; i += 1) {
    const c = waitLine[i];
    if (c.parentId === null) continue;

    const category = pairs.find(
      (v) => v.category && v.category.id === c.parentId,
    );

    if (category === undefined) continue;

    category.channels.push(c);
  }

  // Sort pairs channels by position
  for (let i = 0; i < pairs.length; i += 1) {
    const category = pairs[i];
    category.channels = category.channels.sort(
      (a, b) => a.position - b.position,
    );
  }

  // Sort pairs by category position
  pairs = pairs.sort(
    (a, b) =>
      (a.category ? a.category.position : 0) -
      (b.category ? b.category.position : 0),
  );

  const retChannels = [];

  // Add category and their channels into a list
  for (let i = 0; i < pairs.length; i += 1) {
    const category = pairs[i];
    if (category.category !== null) retChannels.push(category.category);

    for (let j = 0; j < category.channels.length; j += 1) {
      retChannels.push(category.channels[j]);
    }
  }

  return retChannels;
}
