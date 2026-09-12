# The Missing Skills

The computational skills nobody taught you in your science degree.

**Site:** https://katarinagresova.github.io/missing-skills/

Project-based tutorials for people finishing science degrees who can write analysis code
but were never taught git, the shell, or how to make their work visible to other people.

## Contributing

Got stuck on a tutorial? Found something wrong or missing?
[Open an issue](https://github.com/katarinagresova/missing-skills/issues) — reports of
where people get confused are the most useful thing anyone can send.

## Running the site locally

```bash
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
mkdocs serve
```

Then open <http://127.0.0.1:8000>. The site rebuilds as you save.

## Structure

```
docs/
  index.md                      landing page
  tutorials/01-...md            one file per tutorial, numbered for ordering
  assets/                       screenshots and diagrams
mkdocs.yml                      site config and navigation
.github/workflows/deploy.yml    builds and publishes on every push to main
```

Adding a tutorial: create `docs/tutorials/0N-slug.md` and add it to the `nav:` block in
`mkdocs.yml`.

## Deployment

Pushing to `main` builds the site and publishes it to GitHub Pages. Repository settings →
Pages → Source must be set to **GitHub Actions**.

## License

Text released under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); code samples
released under the MIT license.
