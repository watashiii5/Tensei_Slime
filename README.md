# Tensei Slime Reader

An unofficial, fan-made web app for reading the fan translation of
*That Time I Got Reincarnated as a Slime*, with a few bonus features that are absent
in PDF and EPub versions.

**This is NOT an official project.** It is not affiliated with or endorsed by the
official creators or publishers. All rights to *That Time I Got Reincarnated as a
Slime* belong to their respective owners.

## Credits

- Built on top of the open-source [Slime Reader](https://tensurafan.github.io/)
  project by the [tensurafan community](https://github.com/tensurafan/tensurafan.github.io).
- Novel fan translation and manga sources are provided by the tensurafan community.

## Running locally

```
npm install
npm start
```

Then open http://localhost:9001

## Notes

- The MIT license in `LICENSE` covers the *code* only. The novel translation text,
  illustrations, and other media are not covered by it.
- The service worker (offline reading) is currently disabled for this GitHub Pages
  deployment to avoid stale-cache issues during development. The file
  `service-worker.js` is still present if you want to re-enable it later.

## Contributing

If you wish to suggest changes to novel contents, you can find the markdown files
in: [ln/sources](ln/sources).
