import { useEffect, useState } from 'react';
import { TenorFetchResult, TenorGif } from '../../main/utils/tenor';

export default function useGif(url: string): TenorGif | null {
  const [gif, setGif] = useState<TenorGif | null>(null);

  useEffect(() => {
    if (!url.startsWith('https://tenor.com')) {
      setGif(null);
      return;
    }

    window.electron.ipcRenderer
      .invoke('tenor:fetch-gif', url)
      .then((result: TenorFetchResult) => {
        setGif(result.gif);
        return true;
      })
      .catch((err) => console.error(err));
  }, [url]);

  return gif;
}
