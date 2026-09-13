# 2. The file too big for Excel

**What you'll have at the end:** a public repository containing a script that reads 573 MB
of real human genetics data — more rows than Excel can physically hold — and prints a
summary table in about seven seconds. Plus the ability to answer questions about any large
text file without opening it.

**How long:** about two hours. You'll have your first real answer out of the data inside
the first fifteen minutes.

**What you need to know already:** [tutorial 1](01-personal-website.md), or equivalent. You
need `pwd`, `ls`, `cd`, and the `add` / `commit` / `push` loop. Nothing else.

---

## 1. The goal

Sooner or later someone sends you a file that Excel won't open. Or worse — Excel *does*
open it, quietly drops everything past row 1,048,576, and shows you a confident,
wrong answer.

This tutorial is about the moment you stop being blocked by that. By the end you'll take a
573 MB file you've never seen before and answer real questions about it, using about eight
commands that have existed since the 1970s and are already installed on your computer.

The specific questions we'll answer:

- How many gene–trait associations has human genetics actually published?
- What is the single most-studied trait in all of human genetics?
- How many of those associations involve asthma?

None of these are rhetorical. You'll have real numbers for all three.

!!! note "Why the shell and not Python?"

    You may already know enough Python to do this. Python would work, and later tutorials
    use it.

    But a pipeline of shell commands takes fifteen seconds to write, needs no imports, no
    environment, and no decisions about how to read the file. When the question is "what's
    actually in this thing?", that speed is the entire point. You ask, you look, you ask a
    better question. Reaching for a script first turns a two-minute exploration into a
    twenty-minute one.

---

## 2. Get the data

We're using the **GWAS Catalog** — a curated record, maintained by the EMBL-EBI and the
NHGRI, of essentially every genome-wide association ever published. Every row is one
reported link between a position in the genome and a human trait.

It is a genuinely important scientific resource, it's free to download, and it is
comfortably too big for a spreadsheet.

### Make somewhere to put it

```bash
cd ~
mkdir -p projects/too-big-for-excel
cd projects/too-big-for-excel
mkdir data
cd data
```

`mkdir` makes a directory. `mkdir -p` makes any missing parents too, and doesn't complain
if it already exists.

### Download it

```bash
curl -O https://ftp.ebi.ac.uk/pub/databases/gwas/releases/2026/09/04/gwas-catalog-associations-split.zip
```

`curl` fetches things over the network. `-O` is a capital letter O, and it means "save it
under its own name" rather than printing it to the screen. It's about 65 MB, so give it a
moment.

!!! note "Why that long, dated URL?"

    The GWAS Catalog also publishes everything under a `.../releases/latest/` address, which
    is updated every month.

    We're deliberately *not* using it. Pinning to the release of 4 September 2026 means the
    numbers you see will match the numbers printed in this tutorial, and that you can rerun
    this in a year and get the same result. "Latest" is convenient and quietly makes your
    work impossible to reproduce — the same lesson comes back in
    [tutorial 5](../index.md) with software versions instead of data versions.

### Unpack it

=== "macOS / Linux"

    ```bash
    unzip gwas-catalog-associations-split.zip
    ```

=== "Windows (Git Bash)"

    Git Bash doesn't include `unzip`. Use Python instead — you already have it from
    tutorial 1:

    ```bash
    python -m zipfile -e gwas-catalog-associations-split.zip .
    ```

    The `.` at the end means "extract into this folder". If `python` isn't found, try
    `python3`.

Now look at what you've got:

```bash
ls -lh
```

```
-rw-r--r--  1 you  staff    57M  gwas-catalog-download-associations-v1.0.2023.tsv
-rw-r--r--  1 you  staff    88M  gwas-catalog-download-associations-v1.0.2024.tsv
-rw-r--r--  1 you  staff   134M  gwas-catalog-download-associations-v1.0.2025.tsv
-rw-r--r--  1 you  staff    34M  gwas-catalog-download-associations-v1.0.2026.tsv
-rw-r--r--  1 you  staff   262M  gwas-catalog-download-associations-v1.0.pre2023.tsv
-rw-r--r--  1 you  staff    65M  gwas-catalog-associations-split.zip
```

`ls -l` is the long listing — permissions, owner, size, date. `-h` means "human readable",
which turns `274612224` into `262M`. You will use `ls -lh` constantly.

Five files, split by the year each association was added to the catalogue. 573 MB of plain
text.

!!! warning "Do not double-click these"

    Don't open them in Excel, and don't open them in VS Code either. A 262 MB file will
    either refuse, or lock up your editor for several minutes while it tries to render two
    hundred million characters.

    Everything below is designed so that you never open the file at all.

---

## 3. The first question

Here's the whole point of this tutorial, in one command. Run it:

```bash
wc -l *.tsv
```

```
  127672 gwas-catalog-download-associations-v1.0.2023.tsv
  181743 gwas-catalog-download-associations-v1.0.2024.tsv
  273996 gwas-catalog-download-associations-v1.0.2025.tsv
   75149 gwas-catalog-download-associations-v1.0.2026.tsv
  533477 gwas-catalog-download-associations-v1.0.pre2023.tsv
 1192037 total
```

`wc` is "word count"; `-l` asks for lines only. It read 573 MB and answered instantly.

**1,192,037 lines.** Excel's hard limit is **1,048,576 rows** per sheet. This data is
143,461 rows past the point where a spreadsheet can represent it — not slow, not awkward,
*impossible*. Google Sheets gives up much earlier, at around 294,000 rows for a file this
wide.

You just did something Excel cannot do, with one command, on a laptop.

!!! success "Stop here for a second"

    That's the skill. Not the command — the *position*. Someone hands you a file of
    unknown size and unknown content, and instead of "I can't open this", your first move
    is to ask it a question.

    Everything below is more questions.

---

## 4. Looking at a file you can't open

You know how big it is. You have no idea what's in it. Three commands solve that, and none
of them load the whole file.

```bash
head -3 gwas-catalog-download-associations-v1.0.2026.tsv
```

`head` shows the first lines of a file — 10 by default, 3 here. `tail` does the same from
the end.

That output is an unreadable wall of text, because each row has 34 columns of it. So ask a
better question: **what are the columns?**

```bash
head -1 gwas-catalog-download-associations-v1.0.2026.tsv | tr '\t' '\n' | cat -n
```

```
     1	DATE ADDED TO CATALOG
     2	PUBMEDID
     3	FIRST AUTHOR
     4	DATE
     5	JOURNAL
     6	LINK
     7	STUDY
     8	DISEASE/TRAIT
     9	INITIAL SAMPLE SIZE
    10	REPLICATION SAMPLE SIZE
    11	REGION
    12	CHR_ID
    13	CHR_POS
    14	REPORTED GENE(S)
    15	MAPPED_GENE
    ...
    28	P-VALUE
    ...
    34	CNV
```

That is the single most useful command in this tutorial. Take the first line, turn every
tab into a newline (`tr` = translate), and number the results (`cat -n`). Now you have a
numbered menu of the columns, and the numbers are what you'll use to pull them out.

Keep it somewhere. You'll want it for every unfamiliar table you ever meet.

!!! tip "Reading a file interactively"

    ```bash
    less -S gwas-catalog-download-associations-v1.0.2026.tsv
    ```

    `less` shows a file one screen at a time without loading it all. Arrow keys and
    ++page-down++ to move, `/asthma` to search, **`q` to quit**.

    The `-S` matters here: it stops long lines wrapping, so each row stays on one line and
    you can scroll sideways with the arrow keys. Without it, a 34-column row smears across
    forty screen lines and you can't see anything.

    If you take one thing from this box: **`q` quits**. Being stuck in `less` with no idea
    how to leave is a genuine rite of passage.

---

## 5. Pipes

The `|` character in that last command is the single most important idea in the shell.

> A pipe takes what one command *prints* and feeds it to the next command as *input*.

That's it. Each command does one small thing, and you chain them into something specific.
Nothing is written to disk, nothing is loaded into memory all at once, and you build the
chain one piece at a time.

Let's answer the real question: **what is the most-studied trait in human genetics?**

Column 8 is `DISEASE/TRAIT`. Build it up one stage at a time, and actually run each stage —
this is how you'll debug pipelines forever.

**Stage 1 — pull out the column.** `cut` selects fields; `-f8` means field 8. It assumes
tab-separated, which is exactly what we have.

```bash
cut -f8 gwas-catalog-download-associations-v1.0.2026.tsv | head -5
```

```
DISEASE/TRAIT
Circulating PAMR1 levels
Circulating PAMR1 levels
Circulating PAMR1 levels
Circulating PAMR1 levels
```

!!! note "Why `head` is at the end of every stage"

    Without it, the terminal tries to print 75,149 lines and you sit watching text fly past.

    `head -5` cuts it off after five. It also *stops the command early* — the pipeline
    shuts down as soon as `head` has what it needs, so you get an instant answer even on
    the 262 MB file. Put `| head` on the end of anything exploratory.

    If you forget and your terminal floods, press ++ctrl+c++.

**Stage 2 — sort it.** This puts identical values next to each other, which is what the
next step needs.

```bash
cut -f8 gwas-catalog-download-associations-v1.0.2026.tsv | sort | head -5
```

```
1-hour glucose during pregnancy
2-hour glucose during pregnancy
25-hydroxyvitamin D (D2+D3) in pregnancy
25-hydroxyvitamin D (D2+D3) in pregnancy
25-hydroxyvitamin D (D2+D3) in pregnancy
```

**Stage 3 — count the duplicates.** `uniq -c` collapses *adjacent* identical lines and
prefixes each with a count.

```bash
cut -f8 gwas-catalog-download-associations-v1.0.2026.tsv | sort | uniq -c | head -5
```

```
      1 1-hour glucose during pregnancy
      1 2-hour glucose during pregnancy
      5 25-hydroxyvitamin D (D2+D3) in pregnancy
      1 ABHD14B levels
      1 ACE levels
```

!!! warning "`uniq` only sees its neighbours"

    `uniq` does not find duplicates across a whole file. It only collapses lines that are
    *already adjacent*. If you forget the `sort` before it, you get nonsense — and no error
    message, just wrong numbers.

    `sort | uniq -c` is a fixed phrase. Learn it as one unit.

**Stage 4 — sort by the count, biggest first.** `-n` sorts numerically rather than
alphabetically (otherwise 9 beats 1000), and `-r` reverses it.

```bash
cut -f8 gwas-catalog-download-associations-v1.0.2026.tsv | sort | uniq -c | sort -rn | head -5
```

```
   2811 Neutrophil-to-lymphocyte ratio
   2636 Squamous cell lung carcinoma
   2440 Lung adenocarcinoma
   1689 Refractive error
   1246 Estimated bone mineral density
```

That's the top of 2026 alone. Now run it across **all five files at once** by swapping the
filename for `*.tsv`, and ask for twenty:

```bash
cut -f8 *.tsv | sort | uniq -c | sort -rn | head -20
```

```
  28065 Height
  14304 Body mass index
   7275 Hematological traits (multi-trait analysis)
   6910 Height (baseline)
   6844 Type 2 diabetes
   6626 Systolic blood pressure
   5900 Total cholesterol levels
   5677 Platelet count
   5547 Bone mineral density mean
   5501 Electrocardiogram morphology (amplitude at temporal datapoints)
   5332 Triglyceride levels
   5257 Educational attainment
   5074 Diastolic blood pressure
   4930 Red blood cell count
   4638 Heel bone mineral density
   4573 White blood cell count
   4436 Smoking initiation
   4376 Waist-to-hip ratio adjusted for BMI
   4271 Waist circumference adjusted for body mass index
   3820 Insomnia
```

**The most-studied trait in the history of human genetics is height.** Twice, in fact —
"Height" and "Height (baseline)" are counted separately, which is itself worth noticing.

That command read 573 MB across five files and answered in a few seconds. It's five simple
programs, each doing one thing, connected by four pipes.

!!! tip "Build pipelines left to right"

    Nobody writes that command in one go. Write `cut -f8 file | head`, look. Add `| sort`,
    look. Add `| uniq -c`, look.

    When a pipeline gives a surprising answer, delete stages from the right until it starts
    making sense again. That's the whole debugging technique.

---

## 6. grep

`grep` finds lines that match a pattern. It's the command you'll use most often, and the
one with the sharpest edge.

The basic form — how many lines mention asthma, ignoring case?

```bash
grep -ic asthma gwas-catalog-download-associations-v1.0.2025.tsv
```

```
8246
```

- `-i` — ignore case, so `Asthma`, `asthma` and `ASTHMA` all match.
- `-c` — count matching lines instead of printing them.

Drop the `-c` and you get the lines themselves; add `| head -3` so it doesn't flood.

Four more flags cover nearly everything you'll need:

| Flag | What it does |
|---|---|
| `-i` | Ignore case |
| `-c` | Count matching lines, don't print them |
| `-v` | **In**vert — print lines that *don't* match |
| `-w` | Match whole words only, so `ALDH2` doesn't match `ALDH2B` |
| `-n` | Show the line number of each match |

### The trap that will actually bite you

Count asthma across everything, first on whole lines, then on the trait column only:

```bash
cat *.tsv | grep -ic asthma
```

```
17640
```

```bash
cut -f8 *.tsv | grep -ic asthma
```

```
4989
```

**Same word, same data, and the answers differ by a factor of three and a half.**

Neither is a bug. `grep` reads *lines*, not columns — it has no idea the file is a table.
The first number counts every row where "asthma" appears anywhere: in the study title, in
the description of who was recruited, in a list of co-analysed traits. The second counts
rows where asthma is the trait actually being studied.

If someone asks "how many asthma associations are there?", 17,640 is a wrong answer
delivered with total confidence.

!!! danger "This is the most common way to be wrong in the shell"

    `grep` is fast and feels precise, and it is neither column-aware nor
    context-aware. Before you trust a `grep` count on tabular data, ask: *which column did
    I mean?* Then `cut` to that column first.

    Being able to answer a question in one second means you can also be wrong in one
    second.

For the record, what those 4,989 rows actually contain:

```bash
cut -f8 *.tsv | grep -i asthma | sort | uniq -c | sort -rn | head -8
```

```
   1681 Asthma
    469 Asthma (childhood onset)
    279 Allergic disease (asthma, hay fever or eczema)
    199 Atopic asthma
    180 Diisocyanate-induced asthma
    160 Asthma (adult onset)
    145 Asthma and cardiovascular disease
    127 Endometriosis or asthma (pleiotropy)
```

Which is a much more honest answer than a single number: "asthma" isn't one trait, it's a
family of about a hundred differently-defined ones. You could not have seen that in Excel.

---

## 7. Globs

You've been using `*.tsv` for a while now. Time to say what it actually does, because the
mental model matters.

> **The shell expands the pattern before the command ever runs.**

When you type `wc -l *.tsv`, `wc` never sees a `*`. The shell looks in the directory,
finds the five matching names, and runs `wc -l` with five filename arguments. Every command
gets multiple files for free, without knowing anything about patterns.

You can watch it happen:

```bash
echo *.tsv
```

```
gwas-catalog-download-associations-v1.0.2023.tsv gwas-catalog-download-associations-v1.0.2024.tsv gwas-catalog-download-associations-v1.0.2025.tsv gwas-catalog-download-associations-v1.0.2026.tsv gwas-catalog-download-associations-v1.0.pre2023.tsv
```

`echo` just prints its arguments. It printed five filenames, because that's what the shell
handed it.

The patterns:

| Pattern | Matches | Here |
|---|---|---|
| `*` | any characters, including none | `*.tsv` — all five files |
| `?` | exactly one character | `*.202?.tsv` — the four year files, not `pre2023` |
| `[...]` | one character from the set | `*202[56].tsv` — 2025 and 2026 |
| `*` alone | everything in the directory | including the zip — careful |

Try them:

```bash
wc -l *.202?.tsv
wc -l *202[56].tsv
```

!!! warning "`*` is greedier than you expect"

    You might reach for `*20??.tsv` to get the four year files. It doesn't work — it
    matches all five, including `pre2023`:

    ```bash
    echo *20??.tsv | tr ' ' '\n' | wc -l
    ```
    ```
    5
    ```

    Because `*` matches *any* run of characters, it happily swallows
    `...v1.0.pre`, leaving `2023.tsv` to satisfy the rest of the pattern. The fix is to
    pin something `pre2023` doesn't have — a literal dot immediately before the year:
    `*.202?.tsv`.

    **Always check a glob with `echo` before using it in a command that does something.**
    `echo *.tsv` costs nothing; a glob that silently matched one file too many can cost a
    lot.

When a command takes filenames and you give it a glob, it reports per file:

```bash
grep -ic asthma *.tsv
```

```
gwas-catalog-download-associations-v1.0.2023.tsv:102
gwas-catalog-download-associations-v1.0.2024.tsv:468
gwas-catalog-download-associations-v1.0.2025.tsv:8246
gwas-catalog-download-associations-v1.0.2026.tsv:0
gwas-catalog-download-associations-v1.0.pre2023.tsv:8824
```

A per-year breakdown of asthma genetics, for free, because the catalogue happens to be
split by year.

!!! note "The zero is real, and worth a thought"

    2026 shows `0`, in a file with 75,149 rows. That's not an error. The 2026 file only
    covers January to early September, and what got curated in that window was dominated
    by a handful of very large studies — lung cancer, blood counts, refractive error.

    When a count comes back as zero, the useful reflex is "is my search wrong, or is the
    world like that?" Here, checking the top traits of that one file answers it in seconds.

### The header trap

Each of the five files has its own header row. So when you concatenate them, you don't get
one header — you get five, scattered through your data.

```bash
cut -f8 *.tsv | grep -c '^DISEASE/TRAIT$'
```

```
5
```

That's why `wc -l *.tsv` said 1,192,037: it's 1,192,032 actual associations plus five
header lines. Small here, but it's exactly the kind of thing that turns into a real bug when
the "value" you're counting is a number rather than an obvious word.

Strip them with `grep -v`, which keeps everything that *doesn't* match:

```bash
cut -f8 *.tsv | grep -v '^DISEASE/TRAIT$' | sort -u | wc -l
```

```
54297
```

`sort -u` sorts and keeps only unique values. So: **54,297 distinct traits** have been
studied. That's the number with the headers correctly removed.

---

## 8. Saving the answer, not just seeing it

Everything so far has printed to the screen and vanished. Two ways to keep it.

### Redirect to a file

```bash
cut -f8 *.tsv | grep -v '^DISEASE/TRAIT$' | sort | uniq -c | sort -rn > ../top-traits.txt
head -5 ../top-traits.txt
```

`>` sends output into a file instead of the screen. `>>` appends to the end instead.

!!! danger "`>` destroys the file before the command runs"

    `>` empties the target file *first*, then starts the command. So:

    ```bash
    sort data.tsv > data.tsv     # DON'T
    ```

    leaves you with an empty file and no data. There is no undo, and the file wasn't in git.

    Always redirect to a **new** name. This is the single most expensive beginner mistake
    in the shell, and it usually happens to someone's only copy of something.

### Save the commands instead

Here's the more important habit. That top-traits file is an *answer*. In three months you
won't remember how you got it, and your shell history will have rolled over.

What you actually want to keep is the **commands**, in a file, in git.

Go back up to your project folder and write one:

```bash
cd ~/projects/too-big-for-excel
```

Create `summarise.sh` in your editor, containing:

```bash
#!/usr/bin/env bash
# Summarise the GWAS Catalog association files in data/.
# Data: https://ftp.ebi.ac.uk/pub/databases/gwas/releases/2026/09/04/
# Run with: bash summarise.sh

echo "## Rows per file"
wc -l data/*.tsv

echo
echo "## Distinct traits studied"
cut -f8 data/*.tsv | grep -v '^DISEASE/TRAIT$' | sort -u | wc -l

echo
echo "## Top 20 most-studied traits"
cut -f8 data/*.tsv | grep -v '^DISEASE/TRAIT$' | sort | uniq -c | sort -rn | head -20

echo
echo "## Associations mentioning asthma, per file"
grep -ic asthma data/*.tsv
```

Run it:

```bash
bash summarise.sh
```

The whole thing — five files, 573 MB, four separate questions — takes about seven seconds.

!!! note "What the first two lines are"

    `#!/usr/bin/env bash` is a "shebang". It tells the system which program should run this
    file if you execute it directly. Lines starting with `#` are comments.

    The comment recording **where the data came from** is not decoration. A script that
    processes data nobody can find again is not reproducible. This is the cheapest possible
    version of a habit that [tutorial 6](../index.md) makes properly.

### Stop typing `ls -lh`

You have typed `ls -lh` a dozen times by now, and you will type it a few thousand more.
Give it a shorter name:

```bash
alias ll='ls -lh'
```

Now `ll` does the same thing. An alias is a nickname for a command: the shell expands it
before running anything, in the same way it expands a glob.

That one lasts until you close the terminal. To keep it, put it in your shell's config
file — a file that runs automatically every time a terminal opens. Which file depends on
which shell you have, so ask:

```bash
echo $SHELL
```

=== "zsh (default on macOS)"

    ```bash
    echo "alias ll='ls -lh'" >> ~/.zshrc
    source ~/.zshrc
    ```

=== "bash (Linux, Git Bash)"

    ```bash
    echo "alias ll='ls -lh'" >> ~/.bashrc
    source ~/.bashrc
    ```

`source` re-reads the config file in the terminal you already have open, so the alias works
straight away instead of only in the next one.

!!! danger "Two `>`, not one"

    `>>` appends. A single `>` would empty your config file first — the same mistake as
    above, on a file you would rather not lose. If that makes you nervous, open the file in
    your editor and type the line in by hand instead.

Add aliases as the annoyance turns up, not in advance. The ones that stick are always the
commands you have already typed too many times.

!!! warning "Aliases are yours alone"

    An alias lives in *your* config file. It does not exist inside a script, and it does
    not exist on anyone else's machine. Put `ll` in `summarise.sh` and it will work
    perfectly for you and fail for everybody who tries to run it.

    That is the line between the two halves of this section. A **script** is how you make
    work repeatable *for other people*. An **alias** is how you make typing bearable *for
    you*. Keep each one on its own side of that line.

---

## 9. Put it on GitHub

You have a script that does something real. Make it public.

```bash
cd ~/projects/too-big-for-excel
git init -b main
```

`-b main` names the first branch `main`, the same name tutorial 1's repository has. Without
it, older gits call it `master` and print a paragraph of advice about the choice — harmless,
but you'd then have two repositories with two different names for the same thing.

### First: do not commit the data

Before anything else. Create a file called `.gitignore` containing:

```
data/
*.zip
```

!!! danger "Never put large data in git"

    Git stores every version of every file forever. Commit 573 MB of TSV and you have
    permanently made a repository that takes ten minutes to clone — and removing it later
    means rewriting history, which is genuinely unpleasant.

    GitHub blocks any file over 100 MB outright, so the `pre2023` file would be rejected
    anyway.

    **The rule: commit the code that produces the result, and the instructions for getting
    the data. Never the data itself.** Anyone can re-download from the URL in your script.

### Write a README

`README.md` is what GitHub displays on the repository's front page. It's the only thing
most visitors will read:

````markdown
# Too big for Excel

Shell pipelines over the [GWAS Catalog](https://www.ebi.ac.uk/gwas/) — 1,192,032
published gene–trait associations across five files, 573 MB of TSV. About 143,000 rows
more than Excel can hold.

## The data

Not included in this repository. Download it with:

```bash
mkdir -p data && cd data
curl -O https://ftp.ebi.ac.uk/pub/databases/gwas/releases/2026/09/04/gwas-catalog-associations-split.zip
unzip gwas-catalog-associations-split.zip
```

## Usage

```bash
bash summarise.sh
```

## Some findings

- **54,297** distinct traits have been studied.
- The most-studied trait in human genetics is **height**, with 28,065 associations —
  roughly twice the next one, body mass index.
- 4,989 associations study a trait whose name contains "asthma" — but 17,640 rows
  *mention* asthma somewhere. Searching whole lines instead of the trait column
  overcounts by 3.5×.
````

### Commit and push

The loop from tutorial 1, unchanged:

```bash
git status
git add .gitignore summarise.sh README.md
git commit -m "Summarise GWAS Catalog associations with shell pipelines"
```

Run `git status` and check the data files are **not** listed. If they are, your `.gitignore`
isn't right — fix it before pushing.

Then create the repository on GitHub and push in one step:

```bash
gh repo create too-big-for-excel --public --source=. --push
```

Open the URL it prints. That's a second public thing with your name on it — and unlike the
website, this one shows you can handle data.

!!! tip "Link it from your website"

    You built a Projects section in [tutorial 1](01-personal-website.md). Add this to it:

    ```html
    <li>
      <strong>Too big for Excel</strong> —
      shell pipelines over 1.2 million published gene–trait associations.
      <a href="https://github.com/[your-username]/too-big-for-excel">Code</a>
    </li>
    ```

    Edit, `add`, `commit`, `push`. Two minutes, and your site now has content that took
    real work.

---

## 10. When things go wrong

??? failure "`grep` found nothing, but I know the text is there"

    Most likely one of three things.

    1. **Case.** `grep asthma` misses `Asthma`. Use `-i`.
    2. **You're anchoring onto an invisible character.** See the next box — this is the
       nasty one, and these files have it.
    3. **It's in a different column than you think.** Check with
       `head -1 file.tsv | tr '\t' '\n' | cat -n`.

??? failure "An invisible character at the end of every line"

    These files use **Windows line endings**: every line ends with a carriage return *and*
    a newline (`\r\n`), not just a newline. The `\r` is invisible in the terminal, and it
    belongs to the last column of every row.

    So this quietly returns zero:

    ```bash
    cut -f34 data/*.tsv | grep -c "^N$"
    ```
    ```
    0
    ```

    While dropping the `$` finds every one of them:

    ```bash
    cut -f34 data/*.tsv | grep -c "^N"
    ```
    ```
    1192032
    ```

    The value isn't `N`, it's `N\r`, so `$` — which means "end of line" — doesn't match
    right after the `N`.

    **Diagnose it** with `file`, which names the format:

    ```bash
    file data/gwas-catalog-download-associations-v1.0.2026.tsv
    ```
    ```
    ASCII text, with very long lines, with CRLF line terminators
    ```

    Or look at the actual bytes with `od -c`, which prints control characters visibly:

    ```bash
    cut -f34 data/gwas-catalog-download-associations-v1.0.2026.tsv | head -2 | od -c
    ```
    ```
    0000000   C   N   V  \r  \n   N  \r  \n
    ```

    **Fix it** by deleting the `\r` as it flows past, with `tr -d`:

    ```bash
    tr -d '\r' < data/gwas-catalog-download-associations-v1.0.2026.tsv | cut -f34 | sort | uniq -c
    ```

    Only the *last* column is affected — every other column is followed by a tab, not a
    line ending. That's why nothing above this section went wrong.

??? failure "My counts are slightly too high"

    You're probably counting header lines. With five files there are five headers hiding in
    your data:

    ```bash
    cut -f8 *.tsv | grep -c '^DISEASE/TRAIT$'
    ```

    Remove them with `grep -v '^DISEASE/TRAIT$'` before counting.

??? failure "`uniq -c` is giving me the same value several times"

    You didn't sort first. `uniq` only collapses lines that are already next to each other.

    ```bash
    cut -f8 file.tsv | sort | uniq -c    # correct
    cut -f8 file.tsv | uniq -c           # nonsense, silently
    ```

??? failure "My terminal is flooding with text and won't stop"

    Press ++ctrl+c++. That interrupts the running command.

    Then add `| head -20` to the end and run it again. Do this *before* running anything
    exploratory on a big file, not after.

??? failure "`sort` is slow, or says it's out of space"

    `sort` has to hold everything before it can emit the first line, so it's the one
    command here that genuinely needs memory and temporary disk space. On 573 MB it's fine;
    on 50 GB it isn't.

    Two things help: cut down to the one column you need *before* sorting (you've been
    doing this — `cut -f8` throws away 97% of the data first), and use `grep` to filter
    early.

    If it complains about space, point it somewhere with room:
    `sort -T /path/with/space`.

??? failure "`sort -rn` isn't sorting numerically"

    `-n` reads a leading number, and `uniq -c` pads its counts with spaces, which is fine.
    But if your numbers are in a later column you need to say which:
    `sort -k2 -rn` sorts on field 2.

    Also: `sort` without `-n` is alphabetical, where `9` comes after `1000`. If a "biggest
    first" list looks scrambled, this is why.

??? failure "`command not found: unzip`"

    You're on Windows in Git Bash, which doesn't include it. Use Python:

    ```bash
    python -m zipfile -e gwas-catalog-associations-split.zip .
    ```

    On macOS, `tar -xf gwas-catalog-associations-split.zip` also works.

??? failure "`curl: command not found`"

    Try `wget -O gwas-catalog-associations-split.zip <url>` instead. If neither exists,
    paste the URL into your browser and move the downloaded file into `data/`.

??? failure "`No such file or directory` when my glob looks right"

    The shell expands globs against the *current* directory. If you're one level up, a
    pattern that matched five files now matches nothing, and the shell hands the literal
    text `*.tsv` to the command.

    ```bash
    pwd
    ls
    ```

    From the project root the pattern needs the folder: `data/*.tsv`.

??? failure "GitHub rejected my push — file too large"

    You committed the data. GitHub refuses anything over 100 MB.

    If it's your most recent commit and you haven't pushed successfully:

    ```bash
    git reset --soft HEAD~1        # undo the commit, keep the files
    ```

    Then fix `.gitignore`, run `git rm -r --cached data`, and commit again. Check with
    `git status` before pushing. Undoing things properly is
    [tutorial 3](03-redesign-without-fear.md).

---

## 11. Going further

Same data, harder questions. All of these are answerable with what you now know plus one
new idea:

- **Which journal publishes the most GWAS?** Column 5. One `cut`, one `sort | uniq -c`.
  (The answer is lopsided.)
- **How has the field grown?** Column 4 is the publication date. Take the first four
  characters of it — `cut -f4 *.tsv | cut -d- -f1` — and count. `cut -d-` splits on a
  hyphen instead of a tab. The curve from 2005 to now is genuinely striking, and it's the
  figure you'll plot properly in a later tutorial.
- **Which genes turn up in the most associations?** Column 15. Watch out: a large number of
  rows are blank, and some contain two genes separated by a comma. What you do about that
  is a judgement call, which is the real lesson.
- **Which associations are actually genome-wide significant?** Column 28 is the p-value,
  and the conventional threshold is 5×10⁻⁸. This one needs a *numeric comparison*, which
  `grep` cannot do — it's the moment you meet `awk`.

And the tools worth meeting next, when you hit their specific wall:

- **`awk`** — for when you need to compare or compute on a column, not just match text.
  `awk -F'\t' '$28 < 5e-8'` is the natural next step.
- **`sed`** — find-and-replace on a stream.
- **`xargs`** — run a command once per line of input.
- **`csvkit` or `miller`** — proper column- and quote-aware versions of all of this, for
  when your file has commas inside quoted fields and `cut` starts lying to you.

---

## What you actually learned

- **Inspection without opening**: `wc -l`, `head`, `tail`, `less -S`, `file`, `od -c`, and
  `head -1 | tr '\t' '\n' | cat -n` for the column menu.
- **Pipes**: chaining small programs with `|`, and building a pipeline left to right,
  checking each stage.
- **The core five**: `cut`, `sort`, `uniq -c`, `grep`, `wc` — which together answer a
  surprising fraction of all questions about tabular data.
- **Globs**: that `*`, `?` and `[...]` are expanded by the *shell*, before the command
  runs, and that this is why every command handles multiple files.
- **Redirection**: `>` and `>>`, and why `>` onto your input file is unrecoverable.
- **Aliases**: a nickname for a command you type too often, why it belongs in your shell's
  config file, and why it must never appear inside a script.
- **Two ways to be confidently wrong**: `grep` matching whole lines when you meant one
  column, and headers hiding inside concatenated files.
- **The reproducibility habit**: keep the commands, not the output. Commit the script, not
  the data.

And a public repository showing you can take a file that defeats a spreadsheet and get a
real answer out of it in seven seconds.

!!! question "Where did you get stuck?"

    If any step here was confusing, wrong, or missing something —
    [open an issue](https://github.com/katarinagresova/missing-skills/issues). The
    "when things go wrong" section above is built entirely out of those reports, and it's
    the most useful part of this page.
