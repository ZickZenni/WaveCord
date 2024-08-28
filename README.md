## Install

Clone the repo and install dependencies:

```bash
git clone --depth 1 --branch main https://github.com/zickzenni/wavecord
cd WaveCord
npm install
```

## Starting Development

Add your discord token into the 'user' file:

Windows: `%APPDATA%/WaveCord/user`

Linux: `~/.config/WaveCord/user`

Mac: `~/Library/Application Support/WaveCord/user`

#

Start the app in the `dev` environment:

```bash
npm start
```

## Packaging for Production

To package WaveCord for the local platform:

```bash
npm run package
```

## License

MIT © [WaveCord](https://github.com/zickzenni/wavecord)
