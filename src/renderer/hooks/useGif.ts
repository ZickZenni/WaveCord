import { useEffect, useState } from 'react';
import { TenorFetchResult, TenorGif } from '../../main/utils/tenor';

const allowedHosts = ['tenor.com', 'www.tenor.com'];

export default function useGif(url: string): TenorGif | null {
  const [gif, setGif] = useState<TenorGif | null>(null);

  useEffect(() => {
    try {
      const uri = new URL(url);

      if (allowedHosts.includes(uri.host.toLowerCase())) {
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
    } catch {
      setGif(null);
    }
  }, [url]);

  return gif;
}
