# The Missing Skills

*The computational skills nobody taught you in your science degree.*

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

<div class="grid cards" markdown>

-   :material-web: **[1. Your personal website](tutorials/01-personal-website.md)**

    Get something of yours live on the internet in the first twenty minutes, then learn
    git, the shell, and HTML by improving it.

-   :material-console: **[2. The file too big for Excel](tutorials/02-too-big-for-excel.md)**

    Pipes, globs, and `grep`, on 1.2 million rows of real human genetics data — more
    than a spreadsheet can physically hold.

</div>

Planned, in roughly this order:

- **3. Redesign your website without fear** — branches, undoing things, and getting back a file you deleted on purpose.
- **4. Fix something on this site** — your first pull request, reviewed by a real person, on a repository other people read.
- **5. Make a stranger's code run** — virtual environments and pinned dependencies, proven by deleting yours and rebuilding it.
- **6. One command from raw data to figure** — project structure, notebooks vs. scripts, and never touching `data/raw/`.
- **7. The function you keep copy-pasting** — packaging a helper you already wrote, until `pip install` works for someone else.
- **8. Run something longer than your laptop's battery** — SSH, `tmux`, moving data, and job arrays on a cluster.
- **9. The ninety-second version of you** — profile README, pinned repositories, and what a hiring manager actually sees.

Further out, not yet slotted into the order:

- **Ask a question that gets answered** — reading a traceback, building a minimal example, and writing an issue nobody closes.
- **Data that lies to you** — Excel and your gene names, encodings, dates, and joins that quietly drop rows.
- **Tests that catch your mistakes** — `pytest`, and a green badge that re-checks your work on every push.
- **Automate the thing you do every Monday** — a scheduled job that updates your site while you sleep.
- **Figures people can read** — vector formats, colourblind-safe palettes, and figures built by a script you can re-run.
- **A manuscript that survives four co-authors** — writing under version control, built to PDF automatically.

Nothing here has a date attached. The list is public so you can tell whether it's worth
bookmarking.

## Who wrote this and why

I'm [Katarina Grešová](https://github.com/katarinagresova), and I do computational
work in the life sciences. I kept having the same conversation — with friends finishing
wet-lab PhDs, with students, with people switching fields — and it was always the same
handful of skills missing, and always the same feeling that everyone else had been given a
manual they somehow hadn't received.

So I started writing the manual down. The tutorials come out of real sessions with real
people, and the "when things go wrong" sections come straight from watching them get stuck.

!!! question "Got stuck, or something here is wrong?"

    Open an issue on
    [the repository](https://github.com/katarinagresova/missing-skills/issues).
    Questions are genuinely useful to me — every one of them tells me where a tutorial
    isn't doing its job.
