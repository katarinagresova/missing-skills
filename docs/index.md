---
hide:
  - navigation
  - toc
---

<div class="ms-hero" markdown>

<div class="ms-hero__text" markdown>

<span class="ms-hero__badge">Free · Open source · CC BY 4.0</span>

# The computational skills nobody taught you in your science degree.

<p class="ms-hero__tagline">Project-based tutorials. Each one ends with something real on
your GitHub account, not with notes.</p>

[Start with tutorial 1](tutorials/01-personal-website.md){ .md-button .md-button--primary }
[See what's covered](#the-tutorials){ .md-button }

</div>

<div class="ms-term" aria-hidden="true">
<div class="ms-term__bar">
<span class="ms-term__dot"></span>
<span class="ms-term__dot"></span>
<span class="ms-term__dot"></span>
<span class="ms-term__name">~/my-website</span>
</div>
<div class="ms-term__body">
<div class="ms-term__line"><span class="ms-term__prompt">$</span> git add index.html</div>
<div class="ms-term__line"><span class="ms-term__prompt">$</span> git commit -m "my first page"</div>
<div class="ms-term__line ms-term__out">1 file changed, 14 insertions(+)</div>
<div class="ms-term__line"><span class="ms-term__prompt">$</span> git push</div>
<div class="ms-term__line ms-term__ok">live at yourname.github.io<span class="ms-term__caret"></span></div>
</div>
</div>

</div>

<div class="ms-stats" markdown>

- **3** tutorials, written and tested on real people
- **6** more planned, in order
- **0** accounts to create, apart from GitHub

</div>

## Who this is for

You're finishing a degree in biology, chemistry, biomedical engineering, physics, or
something adjacent. You can write code that analyses your data — a script that reads a
CSV, fits a curve, makes a plot. But you've never used a terminal for anything serious,
you're not sure what a pull request is, and you have no idea what employers actually look
at when they open your application.

That gap isn't a gap in your intelligence or your science. Nobody taught you this, because
it isn't on anyone's syllabus.

## What this is

A set of **project-based tutorials**. Each one walks you through building a real thing that
ends up on your GitHub account, public and visible to other people. You will finish each
tutorial with an artefact, not with notes.

This is deliberately not a reference manual. It doesn't cover everything, and it teaches
things in the order you need them rather than the order they'd appear in a textbook. When
a tutorial skips something, that's usually on purpose.

## The tutorials

Start with the first one. After that, two and three can be done in either order.
{ .ms-section-lede }

<div class="ms-tutorials" markdown>

-   <span class="ms-tut-icon">:material-web:{ .lg }</span>
    <span class="ms-tut-title">[1. Your personal website](tutorials/01-personal-website.md)</span>

    Get something of yours live on the internet in the first twenty minutes, then learn
    git, the shell, and HTML by improving it.

    <span class="ms-tut-tags">git · the shell · HTML · GitHub Pages</span>

-   <span class="ms-tut-icon">:material-console:{ .lg }</span>
    <span class="ms-tut-title">[2. The file too big for Excel](tutorials/02-too-big-for-excel.md)</span>

    Pipes, globs, and `grep`, on 1.2 million rows of real human genetics data — more
    than a spreadsheet can physically hold.

    <span class="ms-tut-tags">pipes · globs · `grep` · `sort` · `cut`</span>

-   <span class="ms-tut-icon">:material-source-branch:{ .lg }</span>
    <span class="ms-tut-title">[3. Redesign your website without fear](tutorials/03-redesign-without-fear.md)</span>

    Branches, five ways to undo, and getting back a file you deleted on purpose — on the
    site you are already afraid to touch.

    <span class="ms-tut-tags">branches · merging · five ways to undo</span>

</div>

## What's coming

Planned, in roughly this order:
{ .ms-section-lede }

<div class="ms-roadmap" markdown>

- <span class="ms-step">4</span> **Fix something on this site** — your first pull request, reviewed by a real person, on a repository other people read.
- <span class="ms-step">5</span> **Make a stranger's code run** — virtual environments and pinned dependencies, proven by deleting yours and rebuilding it.
- <span class="ms-step">6</span> **One command from raw data to figure** — project structure, notebooks vs. scripts, and never touching `data/raw/`.
- <span class="ms-step">7</span> **The function you keep copy-pasting** — packaging a helper you already wrote, until `pip install` works for someone else.
- <span class="ms-step">8</span> **Run something longer than your laptop's battery** — SSH, `tmux`, moving data, and job arrays on a cluster.
- <span class="ms-step">9</span> **The ninety-second version of you** — profile README, pinned repositories, and what a hiring manager actually sees.

</div>

Further out, not yet slotted into the order:
{ .ms-section-lede }

<div class="ms-later" markdown>

- **Ask a question that gets answered** — reading a traceback, building a minimal example, and writing an issue nobody closes.
- **Data that lies to you** — Excel and your gene names, encodings, dates, and joins that quietly drop rows.
- **Tests that catch your mistakes** — `pytest`, and a green badge that re-checks your work on every push.
- **Automate the thing you do every Monday** — a scheduled job that updates your site while you sleep.
- **Figures people can read** — vector formats, colourblind-safe palettes, and figures built by a script you can re-run.
- **A manuscript that survives four co-authors** — writing under version control, built to PDF automatically.

</div>

Nothing here has a date attached. The list is public so you can tell whether it's worth
bookmarking.

## Who wrote this and why

<div class="ms-author" markdown>

![Katarina Grešová](assets/katarina.jpg){ .ms-author__avatar }

<div class="ms-author__text" markdown>

I'm [Katarina Grešová](https://katarinagresova.github.io/), and I work on machine
learning for genomics at the Max Delbrück Center in Berlin. I arrived at biology sideways:
a computer science degree first, then a few years writing software for a living, then a
master's in bioinformatics and a PhD on how small RNAs pick their targets.

Coming that way round meant I already had the terminal, git, and the rest of the scaffolding
before I met my first biologist. And what I kept running into was people doing genuinely good
science who were being slowed down, sometimes for weeks, by things nobody had ever sat them
down and explained.

It was the same conversation every time — with friends finishing wet-lab PhDs, with students
in the deep-learning workshops I teach, with people switching fields. The same handful of
skills missing, and the same feeling that everyone else had been handed a manual they somehow
hadn't received.

So I started writing the manual down. The tutorials come out of real sessions with real
people, and the "when things go wrong" sections come straight from watching them get stuck.

</div>

</div>

## Want this taught to your group?

The tutorials started as live sessions, and they still work best that way.
{ .ms-section-lede }

<div class="ms-offer" markdown>

-   <span class="ms-offer__icon">:material-account-group:{ .lg }</span>
    **Run the course for your people**

    A lab, a department, a graduate programme, a summer school. In person or online, as a
    single day or spread across several weeks, and shaped around what your group already
    knows rather than what the tutorials assume.

-   <span class="ms-offer__icon">:material-chat-question:{ .lg }</span>
    **Book a consultation**

    One to one, on something specific: an analysis that needs to be reproducible, a
    project that has outgrown a folder of scripts, or a CV and GitHub profile that don't
    yet show what you can actually do.

</div>

Either way, email me at
[katarina.gresova@mdc-berlin.de](mailto:katarina.gresova@mdc-berlin.de). It helps if you say
who the audience is and what you'd like them to be able to do afterwards.
{ .ms-offer__foot }

<div class="ms-cta" markdown>

### Nothing to install before you begin

Twenty minutes and a browser get your first page live. The rest builds on that one.

[Start with tutorial 1](tutorials/01-personal-website.md){ .md-button .md-button--primary }

</div>

!!! question "Got stuck, or something here is wrong?"

    Open an issue on
    [the repository](https://github.com/katarinagresova/missing-skills/issues).
    Questions are genuinely useful to me — every one of them tells me where a tutorial
    isn't doing its job.
