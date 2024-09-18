export interface TenorGifFormat {
  type: string;
  url: string;
  duration: number;
  preview: string;
  width: number;
  height: number;
  size: number;
}

export interface TenorGif {
  id: string;
  title: string;
  media_formats: TenorGifFormat[];
  created: number;
  content_description: string;
  h1_title: string;
  tags: string[];
  flags: string[];
  hasaudio: boolean;
}

export interface TenorFetchResult {
  gif: TenorGif | null;
}

export default class Tenor {
  public async fetchGif(url: string): Promise<TenorFetchResult> {
    const result: TenorFetchResult = {
      gif: null,
    };

    const uri = new URL(url);

    if (uri.hostname.toLowerCase() !== 'tenor.com') return result;
    if (!uri.pathname.toLowerCase().startsWith('/view/')) return result;

    const response = await fetch(url);
    const text = await response.text();

    const raw = `{"appConfig${text.split('appConfig')[1].split('</script>')[0]}`;
    const json = JSON.parse(raw);

    // eslint-disable-next-line no-restricted-syntax
    for (const id of Object.keys(json.gifs.byId)) {
      const data = json.gifs.byId[id];

      if (!data.loaded) continue;

      const dataRes = data.results[0];

      result.gif = {
        id: dataRes.id,
        title: dataRes.title,
        created: dataRes.created,
        content_description: dataRes.content_description,
        flags: dataRes.flags,
        h1_title: dataRes.h1_title,
        hasaudio: dataRes.hasaudio,
        media_formats: [],
        tags: dataRes.tags,
      };

      // eslint-disable-next-line no-restricted-syntax
      for (const formatType of Object.keys(dataRes.media_formats)) {
        const formatData = dataRes.media_formats[formatType];
        result.gif.media_formats.push({
          type: formatType,
          url: formatData.url,
          duration: formatData.duration,
          preview: formatData.preview,
          size: formatData.size,
          width: formatData.dims[0],
          height: formatData.dims[1],
        });
      }
    }

    return result;
  }
}
