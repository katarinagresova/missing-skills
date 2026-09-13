# 3. Redesign your website without fear

**What you'll have at the end:** the same website, visibly better, redesigned in the open
without the live version breaking once. Plus one experiment you tried, disliked, and threw
away — and the knowledge that throwing it away cost you nothing.

**How long:** about ninety minutes.

**What you need to know already:** [tutorial 1](01-personal-website.md). You need the site
you built there, still live, and the `add` / `commit` / `push` loop. Nothing from
[tutorial 2](02-too-big-for-excel.md) is required, though you'll find it easier if you've
done it.

---

## 1. The goal

Your site has been live for a while now. And you have almost certainly stopped touching it.

Not because you ran out of ideas. Because the version that exists *works*, it has your name
on it, and you might have sent the link to someone who matters. Changing it means risking
it. So the tagline you were never happy with is still there.

That instinct is correct, and the solution is not "be more careful". It's that you are
missing the part of git that makes changes cheap. Today you get it.

By the end of this tutorial you will have:

- deliberately made your site worse, looked at it, and thrown the work away
- deleted `style.css` off your own computer and got it back
- undone a commit you already pushed to GitHub
- caused a merge conflict on purpose and resolved it
- shipped a real redesign

The live site stays up the whole time.

!!! note "You will break things in this tutorial. That's the tutorial."

    Every destructive command here is one you run on purpose, in a place where it's safe,
    while you still have the energy to be curious about it. That's a much better
    introduction than meeting `git reset --hard` at eleven at night the day before a
    deadline.

---

## 2. Read your own history

You can't undo what you can't see. So before anything else, look at what git has been
quietly recording since [tutorial 1](01-personal-website.md#4-the-git-loop).

Open a terminal, go to your site's folder, and start the preview server — you'll want it
running for the rest of this tutorial:

```bash
cd ~/projects/your-username.github.io
python -m http.server 8000
```

Open `http://localhost:8000` in your browser. That's your site, served off your own
computer — the same files GitHub is showing the world, except nobody can see this copy.

Leave that window alone; the server keeps running until you stop it with ++ctrl+c++. Open a
**second** terminal in the same folder for everything below.

??? note "You last did this a while ago and something already went wrong"

    **`command not found: python`** — try `python3 -m http.server 8000`. Most systems have
    one or the other, not both.

    **`cd: no such file or directory`** — the folder is somewhere else, or on a machine you
    aren't sitting at. Go looking:

    ```bash
    find ~ -maxdepth 4 -type d -name "*.github.io" 2>/dev/null
    ```

    If it genuinely isn't there, clone it again — everything is on GitHub, and the folder
    on your laptop was never the only copy:

    ```bash
    cd ~/projects
    gh repo clone your-username/your-username.github.io
    ```

    **`Address already in use`** — a server from a previous session is still running.
    Either find that terminal window and press ++ctrl+c++, or just use another port with
    `python -m http.server 8001` and open `localhost:8001` instead.

    **The browser shows a list of files instead of your page** — you started the server one
    folder too high. `ls` should show `index.html`. If it shows the repository folder
    instead, `cd` into it and start again.

    **You're picking this tutorial back up halfway through** — run `git branch`. The branch
    with the `*` next to it is where you left off, and `git log --oneline -3` will remind
    you what you'd done.

```bash
git log
```

You get every commit you've ever made, newest first, each one looking roughly like this:

```
commit 7b28e4d9c3f5a1e806d2b4f7a9e1c3d5b8f0a2e6
Author: Your Name <you@example.com>
Date:   Mon Sep 8 14:22:31 2025 +0200

    Add content and stylesheet
```

Press ++q++ to get out. (`git log` hands its output to a **pager** — a program for
scrolling through text that's too long for one screen. ++space++ pages down, ++q++ quits
and gives you your prompt back. If you've ever been trapped in a terminal that won't take
new commands, this was probably why.)

That output is too much. This is the version you'll actually use:

```bash
git log --oneline
```

```
a3f91c2 Add education section
7b28e4d Add content and stylesheet
e91d3f8 Change the heading
4c2a8b1 Create index.html
```

One line per commit: a short **hash** and your message. This is the moment those commit
messages from [tutorial 1](01-personal-website.md#5-working-on-your-own-computer) either
pay off or don't. `"Add education section"` tells you something. `"update"` tells you
nothing, and you're reading this list precisely because something is wrong and you need to
find when.

### Hashes are how you name a commit

That `a3f91c2` is the commit's name. The full name is forty characters long — the one git
shows you is the first seven, which is essentially always enough to identify it uniquely.

Anywhere a command below wants a commit, you paste one of these.

```bash
git show 7b28e4d
```

That prints what that commit actually changed: lines starting with `+` were added, lines
starting with `-` were removed. Again, ++q++ to get out.

!!! tip "Your hashes will be different from mine"

    Hashes are computed from the content, the author, and the timestamp, so nobody else's
    repository has the same ones. Every time you see `a3f91c2` or similar in this tutorial,
    substitute a hash from **your** `git log --oneline` output.

### `HEAD` means "where I am now"

Git needs a word for the commit you're currently sitting on, and that word is `HEAD`.

You can count backwards from it with `~`:

- `HEAD` — the latest commit
- `HEAD~1` — the one before that
- `HEAD~3` — three commits back

So `git show HEAD~1` shows your second-newest commit without you having to look up its
hash. You'll use this constantly.

### The history of one file

```bash
git log --oneline -- style.css
```

Only the commits that touched `style.css`. The `--` means "everything after this is a
filename, not a branch name" — git accepts both in the same position and that's how you
tell it which you meant.

This is the command for "when did this file last work?", and you'll come back to it in
section 5.

---

## 3. A branch is a place to be wrong

Here's the change we're going to make first: put the page into two columns. Magazines do
it, it looks designed, and it is a genuinely reasonable thing to want to try.

It's also, as you're about to discover, a bad idea. Which is exactly why it's the right
first experiment.

### Make somewhere to try it

```bash
git switch -c try-two-columns
```

```
Switched to a new branch 'try-two-columns'
```

`switch -c` means "switch to a new branch, creating it". You are now on a branch called
`try-two-columns`, and your `main` branch is sitting exactly where you left it.

Check any time with:

```bash
git branch
```

```
  main
* try-two-columns
```

The `*` is you.

!!! note "What a branch actually is"

    Not a copy of your folder. Not a duplicate of your files. A branch is **a name that
    points at a commit** — that's the whole thing. Creating one writes a few dozen bytes to
    disk and takes no measurable time, which is why experienced people create them without
    thinking twice.

    When you commit, the branch name you're on moves forward to the new commit. The other
    names stay where they are. That's the entire mechanism, and everything else about
    branches follows from it.

### Make the site worse

Open `style.css` and add this at the bottom:

```css
main {
  column-count: 2;
  column-gap: 2.5rem;
}
```

Save, refresh `localhost:8000`.

Two columns. And now look at it properly:

- **Narrow your browser window** until it's roughly phone-width. The columns become two
  unreadable slivers of text. Over half the people who open your site will be on a phone.
- **Look at where the sections break.** Your Education list probably splits across the
  column boundary, with two entries at the bottom of the left column and one stranded at
  the top of the right.

It looked good in your head. It doesn't survive contact with an actual browser. This is
completely normal and it is the reason you want branches — not because you write bad code,
but because some ideas can only be evaluated after you've built them.

Commit it anyway. It costs nothing, and having it committed is what makes the next part a
clean demonstration:

```bash
git add style.css
git commit -m "Try a two-column layout"
```

### The part that removes the fear

Leave the browser open on `localhost:8000`. In your terminal:

```bash
git switch main
```

Now **refresh the browser**.

The columns are gone. Your page is back exactly as it was. Not undone, not rebuilt — the
files on your disk changed the instant you pressed enter. Open `style.css` in your editor
and the `column-count` lines are simply not there.

```bash
git switch try-two-columns
```

Refresh again. They're back.

That's it. That's the whole trick, and it's worth sitting with for a second: switching
branches rewrites the files in your folder to match that branch, and nothing is lost in
either direction.

!!! success "Your experiment was never public"

    Look at your real site at `https://your-username.github.io` right now. Two columns?
    No.

    In [tutorial 1](01-personal-website.md#3-get-something-live) you set GitHub Pages to
    deploy from the `main` branch. **Pages publishes `main` and ignores everything
    else.** You could push `try-two-columns` to GitHub this minute and the world would
    still see the old page.

    That is the property that makes the rest of this tutorial safe: you have somewhere to
    be wrong that the internet cannot see.

### Throw it away

You've decided against it. Go back to `main` and delete the branch:

```bash
git switch main
git branch -D try-two-columns
```

```
Deleted branch try-two-columns (was 5d91a7c).
```

Gone — the branch name and the commit on it. `git log --oneline` shows no trace of the
two-column experiment, because on `main` it never happened.

You spent ten minutes finding out that an idea didn't work, and then paid nothing to
un-have it. Do that twenty more times and you have the actual working method.

!!! warning "`-d` and `-D` are different"

    `git branch -d name` is the safe one: it refuses if the branch has commits you haven't
    merged anywhere, because deleting it would throw work away.

    `git branch -D name` is the same command with the safety off — "yes, I know, throw it
    away". We used `-D` here because throwing it away was the entire point. Reach for
    lowercase `-d` by default and let it stop you.

---

## 4. The redesign you keep

Now the real one. Your site is black text on white, permanently, and roughly half your
visitors have their computer set to dark mode. We'll fix that — and do it in a way that
makes every future colour change a one-line edit.

```bash
git switch -c redesign
```

### Commit one: name your colours

Right now your colours are scattered through `style.css` as raw hex codes. Pull them out
into named variables at the top.

Replace the contents of `style.css` with:

```css
:root {
  --background: #ffffff;
  --text: #24292f;
  --muted: #57606a;
  --link: #0969da;
}

body {
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  line-height: 1.6;
  max-width: 42rem;
  margin: 3rem auto;
  padding: 0 1.25rem;
  background: var(--background);
  color: var(--text);
}

h1 {
  margin-bottom: 0.25rem;
}

.tagline {
  color: var(--muted);
  margin-top: 0;
}

a {
  color: var(--link);
}

section {
  margin-top: 2.5rem;
}
```

`:root` means "the whole document". Anything starting with `--` is a **custom property** —
a name you invent for a value — and `var(--name)` uses it. The browser does this natively;
there's nothing to install.

Refresh `localhost:8000`.

Nothing has changed. That's correct, and it's worth saying out loud: **this commit is
deliberately invisible.** You rearranged how the colours are expressed without changing
what they are. Commits that change nothing visible are a normal and good thing — they're
much easier to review, and if the next commit breaks something, you know it wasn't this
one.

```bash
git add style.css
git commit -m "Move colours into CSS variables"
```

### Commit two: the bit you can see

Now that the colours have names, dark mode is one block. Add it directly under the `:root`
block:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0d1117;
    --text: #e6edf3;
    --muted: #9198a1;
    --link: #4493f8;
  }
}
```

`prefers-color-scheme` is a question to the operating system: has this person asked for
dark mode? If yes, these four values replace the ones above, and every rule using
`var(--text)` follows automatically. You didn't touch `body`, `.tagline`, or `a` at all.

To see it, switch your computer to dark mode:

=== "macOS"

    System Settings → Appearance → Dark

=== "Windows"

    Settings → Personalisation → Colours → Choose your mode → Dark

=== "Linux"

    GNOME: Settings → Appearance → Style → Dark. KDE: Settings → Appearance → Global
    Theme → Breeze Dark. If your desktop doesn't offer it, use the browser tab.

=== "Firefox / Chrome, without changing your OS"

    Open developer tools (++f12++), then in the three-dot menu of the tools panel:
    More tools → Rendering → **Emulate CSS `prefers-color-scheme`**.

Refresh. Your site is dark, and it flips back the moment you switch your OS back.

```bash
git add style.css
git commit -m "Add dark mode"
```

### Look at what you've done

```bash
git log --oneline
```

```
c4e8a91 Add dark mode
b72f3d5 Move colours into CSS variables
a3f91c2 Add education section
...
```

Two commits on this branch, sitting on top of the history `main` already had.

To see the whole branch as a single change:

```bash
git diff main
```

Everything that differs between `main` and where you are now. Add `--stat` for just the
summary:

```bash
git diff main --stat
```

```
 style.css | 23 ++++++++++++++++++++---
 1 file changed, 20 insertions(+), 3 deletions(-)
```

This is the command to run before you merge anything, ever. It's the last cheap moment to
notice that you also left a debugging line in.

### Push the branch

```bash
git push -u origin redesign
```

The `-u` sets up the connection between your local `redesign` and a `redesign` on GitHub,
so that from now on plain `git push` on this branch knows where to go. You only need `-u`
the first time you push a new branch.

Now go and look at `https://your-username.github.io`.

**Still the old site.** Your redesign is on GitHub — you can see the branch in the
repository's branch dropdown — and it is still not published, because Pages only builds
`main`. Backed up, shareable, reviewable, not live.

That gap between "pushed" and "published" is the thing tutorial 4 is built on.

---

## 5. Five ways to undo

You now have somewhere safe to work. The other half of losing the fear is knowing how to
take something back.

There is no single undo command in git, and this is the main reason it feels hostile.
There are several, and which one you need depends entirely on **how far the mistake got**:

| Where the mistake is | What to run |
|---|---|
| Saved in your editor, not committed | `git restore <file>` |
| A file you deleted, not committed | `git restore <file>` |
| Committed, not pushed | `git reset --soft HEAD~1` |
| Committed and pushed | `git revert <hash>` |
| In a commit from last week | `git restore --source=<hash> <file>` |

Come back to that table later. For now, do all five, on purpose. Stay on the `redesign`
branch.

### First: look before you undo

Every one of these starts the same way.

```bash
git status
```

`git status` tells you which of the situations above you're in, in plain words, and it
cannot break anything. Run it before and after every command in this section.

Then, for changes you haven't committed:

```bash
git diff
```

That shows exactly what you're about to throw away, `-` lines for what goes and `+` lines
for what came in. Nobody has ever regretted running `git diff` before an undo.

### 1. The change you haven't committed

Open `style.css` and wreck something. Change `max-width: 42rem` to `max-width: 8rem`.
Save, refresh, watch your text squeeze into a useless vertical ribbon.

```bash
git status
```

```
Changes not staged for commit:
        modified:   style.css
```

```bash
git diff
```

```
-  max-width: 42rem;
+  max-width: 8rem;
```

Now put it back:

```bash
git restore style.css
```

Refresh the browser — fixed. Look in your editor — the file's contents changed under you,
back to what was in the last commit.

!!! danger "`git restore` does not ask twice"

    It overwrites the file with the committed version and the edits you'd made are gone
    for good. Git can recover anything you ever *committed*; it cannot recover something
    you only saved in your editor.

    This is the one command in this tutorial that can genuinely lose work. Run `git diff`
    first and read it.

### 2. The file you deleted

The classic. Do it deliberately:

```bash
rm style.css
```

Refresh `localhost:8000`. Your page is now unstyled — bare black-on-white browser default,
full width, ugly. The file is not in a recycle bin. It's gone from your disk.

```bash
git status
```

```
Changes not staged for commit:
        deleted:    style.css
```

Git noticed, and git has a copy from your last commit. Same command as before:

```bash
git restore style.css
```

Refresh. Back, exactly.

Note what just happened: **the recovery for "I deleted a file" and "I broke a file" is the
same command**, because from git's point of view they're the same event — the file on disk
no longer matches the last commit.

!!! success "Say it out loud"

    Anything you have committed, you can get back. The commit is the moment work becomes
    safe. This is the actual argument for committing often — not tidiness, not process.
    Every commit is a point you can return to, and the gap between commits is the only
    window where you can genuinely lose something.

### 3. The commit you just made, and haven't pushed

Make a bad commit on purpose:

```bash
echo "body { font-size: 1000px; }" >> style.css
git add style.css
git commit -m "Enormous text, obviously a mistake"
```

Refresh and admire it. Then:

```bash
git log --oneline
```

Your mistake is at the top. Take the commit back:

```bash
git reset --soft HEAD~1
```

Nothing visible happens, which is confusing until you look:

```bash
git log --oneline    # the commit is gone
git status           # the change is back, staged, waiting
```

`HEAD~1` is "one commit before where I am". `--soft` means "un-commit it, but keep the
changes". You are back at the moment just before you typed `git commit` — which is usually
what you actually wanted, because most bad commits are a good change with a typo in the
message, or two unrelated things committed together.

!!! note "The staging area, finally"

    [Tutorial 1](01-personal-website.md#4-the-git-loop) mentioned that git has "a staging
    area with its own theory" and told you to ignore it. This is the point where you need
    it.

    `git add` does not save anything. It puts a change into a holding area — the change is
    then **staged**, meaning "include this in the next commit". `git commit` saves
    everything that is staged, and nothing else.

    ```
    your files  ──git add──▶  staging area  ──git commit──▶  history
    ```

    Tutorial 1 hid this by always running `git add .` and committing straight away, so the
    holding area was only ever full for a second. `reset --soft` leaves you standing in
    that second: the commit is gone, but the change is still staged, ready to be committed
    again properly.

Here the change really is rubbish, so throw it away too:

```bash
git restore --staged style.css
git restore style.css
```

One command per place the change is sitting: the first takes it out of the staging area,
the second throws away the edit to the file itself. Refresh — normal text.

!!! danger "`--soft` keeps your work. `--hard` does not."

    `git reset --hard HEAD~1` un-commits **and** deletes the changes from your files, with
    no confirmation. It is the single most common way people actually lose work in git.

    Use `--soft`. If you then decide the changes should go too, throw them away in a
    separate, deliberate step — as we just did. Two small steps you can stop between beat
    one irreversible one.

    (And if you've already run `--hard` and regret it, it is usually still recoverable.
    See "When things go wrong" below.)

!!! warning "Only for commits you haven't pushed"

    `reset` rewrites your history — it makes commits stop existing. That's fine while
    they're only on your laptop. Once a commit is on GitHub, other people and other
    machines may have it, and rewriting history underneath them causes the confusing
    rejected-push errors you may already have hit in
    [tutorial 1](01-personal-website.md#7-when-things-go-wrong).

    For anything already pushed, use `revert` instead. That's next.

### 4. The commit you already pushed

Make a mistake, and this time send it to GitHub:

```bash
echo "a { color: #ff00ff; }" >> style.css
git add style.css
git commit -m "Make links magenta"
git push
```

Refresh — every link on your page is now magenta. It's on GitHub. You can't pretend it
didn't happen, and you shouldn't try.

Get the hash:

```bash
git log --oneline
```

```
9d3c7f1 Make links magenta
c4e8a91 Add dark mode
...
```

Then:

```bash
git revert --no-edit 9d3c7f1
```

```
[redesign 2a8e4b6] Revert "Make links magenta"
```

Refresh — links are back to blue. And:

```bash
git log --oneline
```

```
2a8e4b6 Revert "Make links magenta"
9d3c7f1 Make links magenta
c4e8a91 Add dark mode
```

**Both commits are there.** `revert` doesn't erase the mistake; it adds a new commit that
does the exact opposite. The history stays honest — this happened, then it was undone —
and because you only ever added a commit, nobody else's copy is disturbed.

```bash
git push
```

!!! tip "What `--no-edit` is for"

    Without it, `git revert` opens a text editor to let you write the commit message.
    On many systems that editor is `vim`, which does not tell you how to leave, and this
    is a genuinely common way to get stuck.

    `--no-edit` accepts the default message — `Revert "Make links magenta"` — which is
    almost always the right one. If you ever do land in vim by accident: press ++escape++,
    then type `:q!` and press ++enter++ to leave without saving.

!!! note "reset or revert?"

    **Has it been pushed?** No → `reset`. Yes → `revert`.

    That's the whole decision. Both undo a commit; they differ in whether they pretend it
    never happened, and you only get to pretend while the commit is still private.

### 5. The file you deleted three commits ago

The hardest case, and the one that feels impossible: you deleted something a while back,
committed, carried on working, and now you want it back — without losing everything you've
done since.

```bash
git log --oneline -- style.css
```

```
2a8e4b6 Revert "Make links magenta"
9d3c7f1 Make links magenta
c4e8a91 Add dark mode
b72f3d5 Move colours into CSS variables
7b28e4d Add content and stylesheet
```

Every commit that touched the file. Pick the one where it was last in a state you liked —
say `c4e8a91`, before the magenta business — and pull that one file out of it:

```bash
git restore --source=c4e8a91 style.css
```

Your `style.css` is now the version from that commit. Everything else in your folder is
untouched, and your history is untouched — you've reached back into an old commit and
lifted one file out of it.

Check what you got:

```bash
git diff
```

If it's what you wanted, commit it. If not, `git restore style.css` puts you back.

!!! tip "One commit earlier"

    When you're recovering a file that was *deleted*, the commit that deleted it is the one
    you'll find in the log — and the file isn't in that commit, it's in the one before.

    Add a `^` for "the commit before this one":

    ```bash
    git restore --source=9d3c7f1^ style.css
    ```

    `^` and `~1` mean the same thing here. Both read as "one step back".

### Tidy up before moving on

You've deliberately made a mess. Get back to clean:

```bash
git status
git restore style.css     # if anything is still modified
git status
```

You want "nothing to commit, working tree clean" before the next section.

---

## 6. When two changes collide

One thing left that people are afraid of, and there's no reason to meet it for the first
time during something that matters.

While you've been redesigning, imagine you spotted a typo on your live site and fixed it
straight away on `main`. Meanwhile your `redesign` branch has been rewriting that same
line. Two versions of one line, and git will refuse to guess.

Let's cause it.

### Change the line on `main`

```bash
git switch main
```

Open `index.html` and edit the tagline — the `<p class="tagline">` line — to anything
slightly different from what's there. For example:

```html
<p class="tagline">MSc student in molecular biology, moving into computational biology.</p>
```

```bash
git add index.html
git commit -m "Fix wording in the tagline"
git push
```

### Change the same line on `redesign`

```bash
git switch redesign
```

Edit the *same line* to something clearly different:

```html
<p class="tagline">Molecular biology, increasingly done in a terminal.</p>
```

```bash
git add index.html
git commit -m "Sharpen the tagline"
```

### Collide them

Bring the `main` changes into your branch:

```bash
git merge main
```

```
Auto-merging index.html
CONFLICT (content): Merge conflict in index.html
Automatic merge failed; fix conflicts and then commit the result.
```

There it is. Nothing is broken — git has stopped and is waiting for you.

```bash
git status
```

```
You have unmerged paths.
  (fix conflicts and run "git commit")

Unmerged paths:
        both modified:   index.html
```

### What's in the file

Open `index.html`. Where the tagline was:

```html
<<<<<<< HEAD
  <p class="tagline">Molecular biology, increasingly done in a terminal.</p>
=======
  <p class="tagline">MSc student in molecular biology, moving into computational biology.</p>
>>>>>>> main
```

Read it as three parts:

- Between `<<<<<<< HEAD` and `=======` — **your version**, the branch you're standing on.
- Between `=======` and `>>>>>>> main` — **their version**, the branch you're merging in.
- `>>>>>>> main` names where the second one came from.

Git has written both into the file and is asking which you want. That's all a conflict is.

### Resolve it

Delete the parts you don't want, **including all three marker lines**, until the file
contains exactly what you want it to contain. Keeping your version:

```html
  <p class="tagline">Molecular biology, increasingly done in a terminal.</p>
```

You're not obliged to pick one whole side — you can keep half of each, or write something
new. The file is just a file; make it correct.

Then tell git you're done:

```bash
git add index.html
git commit -m "Merge main into redesign"
```

```bash
git log --oneline
```

Your history now shows both lines of work joined back together.

!!! danger "Check for leftover markers"

    `<<<<<<<` and `>>>>>>>` are not special to git — they're ordinary text it wrote into
    your file. If you miss one, git will happily commit it, and it will appear on your live
    website.

    Before committing a resolved conflict:

    ```bash
    grep -rn "<<<<<<<" .
    ```

    No output means you're clean. That's `grep` from
    [tutorial 2](02-too-big-for-excel.md#6-grep), with one flag it didn't cover: `-r`
    searches every file in the folder and below it, rather than one file you name. The `.`
    is that folder — here, your whole site.

!!! tip "The escape hatch"

    At any point during a conflict, before you commit:

    ```bash
    git merge --abort
    ```

    Everything goes back to how it was before you typed `git merge`. Markers removed,
    branch untouched, as though it never happened.

    Nobody has to fight a conflict they don't understand. Abort, think, try again.

!!! note "Conflicts are rarer than their reputation"

    Git merges different files automatically, and different parts of the same file
    automatically. You only get a conflict when two commits change **the same lines of the
    same file**, which is why we had to arrange one on purpose.

    The habit that prevents most of them: merge `main` into your branch regularly while you
    work, rather than saving it all up. Small collisions are easy; a month of them at once
    is not.

---

## 7. Ship it

Your `redesign` branch has everything: variables, dark mode, the sharpened tagline, and the
fix from `main`. Time to make it the real site.

Check it once more, honestly, while you're still on the branch:

```bash
git diff main --stat
```

```
 index.html |  2 +-
 style.css  | 23 ++++++++++++++++++++---
 2 files changed, 21 insertions(+), 4 deletions(-)
```

Read that list. Is every changed file one you meant to change?

Then go to `main` and merge:

```bash
git switch main
git merge redesign
```

```
Updating 8f4d2a1..e5c9b3a
Fast-forward
 index.html |  2 +-
 style.css  | 23 ++++++++++++++++++++---
 2 files changed, 21 insertions(+), 4 deletions(-)
```

Same two files, same numbers as the preview — which is the point of running it.

**"Fast-forward"** means there was nothing to reconcile — `main` hadn't moved since you last
brought it into your branch, so git just slid the `main` label forward to where `redesign`
already was. No merge commit needed. When you see that word, it means the merge was
trivial, which is a good sign.

```bash
git push
```

Now go to `https://your-username.github.io` and refresh. Give it a minute — the **Actions**
tab of your repository shows an orange dot while it builds, a green tick when it's done.

Your redesign is live. Switch your computer to dark mode and reload it.

### Clean up the branch

The work is merged into `main`, so the branch name has done its job:

```bash
git branch -d redesign
```

```
Deleted branch redesign (was e5c9b3a).
```

This time lowercase `-d` works, because the commits are safely on `main` — that's precisely
what `-d` checks for. And delete the copy on GitHub:

```bash
git push origin --delete redesign
```

Deleting the branch does not delete the commits. They're part of `main`'s history now.
`git log --oneline` shows all of it.

!!! tip "Branch names"

    Short, lowercase, hyphenated, and about the change: `redesign`, `dark-mode`,
    `fix-broken-cv-link`. Not `new`, not `test2`, not `stuff`.

    You'll have three or four branches going at once soon enough, and `git branch` is a
    list you have to read.

---

## 8. When things go wrong

??? failure "`error: Your local changes would be overwritten by checkout`"

    You tried to switch branches with uncommitted edits that the other branch would have
    to overwrite. Git stopped rather than silently destroying them.

    Three options:

    ```bash
    git commit -am "Work in progress"   # keep them here, on this branch
    ```

    ```bash
    git stash                           # put them aside for a moment
    git switch main
    # ... later ...
    git switch -                        # back to the previous branch
    git stash pop                       # and get them back
    ```

    ```bash
    git restore .                       # throw them away — irreversible
    ```

    `git stash` is a shelf for unfinished work. `git stash pop` takes it back off the
    shelf. It's useful, and also easy to forget you left something there, so prefer just
    committing when you're on your own branch.

??? failure "`You are in 'detached HEAD' state`"

    You ran something like `git checkout a3f91c2` — a commit hash rather than a branch
    name. You're now looking at that old commit directly, not standing on any branch. It's
    a fine place to look around and a bad place to work, because commits you make here
    belong to no branch and are easy to lose.

    Get out:

    ```bash
    git switch main
    ```

    If you already made commits there and want to keep them, give them a branch before
    leaving:

    ```bash
    git switch -c rescued-work
    ```

    This is one reason to prefer `git switch` and `git restore` over `git checkout`: they
    can't put you here by accident.

??? failure "`error: the branch 'x' is not fully merged`"

    `git branch -d` refusing to delete, because the branch has commits that aren't on any
    other branch — deleting it would throw work away.

    Either it's a mistake, and you should merge first:

    ```bash
    git switch main
    git merge x
    git branch -d x
    ```

    Or you meant it, as with the two-column experiment:

    ```bash
    git branch -D x
    ```

    The error is git being careful. Read it and decide, rather than reaching straight for
    `-D`.

??? failure "I ran `git reset --hard` and lost work"

    Probably not, if the work was ever committed. Git keeps a private log of everywhere
    `HEAD` has been:

    ```bash
    git reflog
    ```

    ```
    e5c9b3a HEAD@{0}: reset: moving to HEAD~1
    9d3c7f1 HEAD@{1}: commit: The commit I thought I destroyed
    c4e8a91 HEAD@{2}: commit: Add dark mode
    ```

    Find the commit you want and put a branch on it:

    ```bash
    git switch -c recovered 9d3c7f1
    ```

    Your commit is back, on a new branch, and you can merge or cherry-pick from there.

    `git reflog` is the closest thing git has to a universal panic button. It only covers
    things that were **committed** — changes you merely saved in your editor are not in
    there.

??? failure "I'm stuck in an editor I don't recognise"

    Some git commands open a text editor for a commit message — `git revert` without
    `--no-edit`, `git merge` when it creates a merge commit, `git commit` without `-m`. On
    many systems that editor is `vim`, which gives you no visible way out.

    - Leave **without** saving: press ++escape++, type `:q!`, press ++enter++.
    - Save and continue: press ++escape++, type `:wq`, press ++enter++.

    To stop it happening again, tell git to use something else:

    ```bash
    git config --global core.editor "code --wait"   # VS Code
    git config --global core.editor "nano"          # a simple terminal editor
    ```

??? failure "`fatal: The current branch x has no upstream branch`"

    You're pushing a branch GitHub has never seen. Git wants to be told where it goes, once:

    ```bash
    git push -u origin x
    ```

    After that, plain `git push` works on this branch for good.

??? failure "I merged and pushed, but the live site hasn't changed"

    In order:

    1. **Check the Actions tab** of your repository. Orange dot = still building, wait a
       minute. Red cross = the build failed, click it for the reason.
    2. **Check you merged into `main`.** `git log --oneline main` — are your commits there?
       Pages publishes `main` and nothing else.
    3. **Check you actually pushed.** `git status` will say "Your branch is ahead of
       'origin/main' by 2 commits" if you didn't.
    4. **Hard-refresh the browser** — ++ctrl+shift+r++, or ++cmd+shift+r++ on macOS.
       Browsers cache CSS aggressively and this is very often the real answer.

??? failure "I did all my work on `main` by accident"

    Common, and fixable. If you haven't pushed, move the commits onto a branch where they
    belong:

    ```bash
    git switch -c redesign      # branch here, keeping the commits
    git switch main
    git reset --hard origin/main
    ```

    The first line creates a branch at your current position, so the commits now live on
    `redesign` too. The last line moves `main` back to match GitHub. `--hard` is safe here
    *specifically because* you just saved the commits on another branch — check
    `git log --oneline redesign` before running it.

??? failure "`git switch` isn't recognised"

    `git switch` and `git restore` arrived in git 2.23, in 2019. Check your version:

    ```bash
    git --version
    ```

    If it's older, update git. In the meantime the older equivalents work everywhere:

    | New | Old |
    |---|---|
    | `git switch main` | `git checkout main` |
    | `git switch -c new` | `git checkout -b new` |
    | `git restore file` | `git checkout -- file` |
    | `git restore --source=abc123 file` | `git checkout abc123 -- file` |

!!! note "Why every answer online says `checkout`"

    `git checkout` did both of these jobs — switching branches *and* discarding file
    changes — for git's first fourteen years. One command, two unrelated and one
    destructive behaviour, distinguished by a `--` you could easily forget.

    `switch` and `restore` split them apart. The old spelling still works and isn't going
    anywhere, which is why the internet is full of it. When you see `git checkout` in an
    answer, look at what comes after it: a branch name means switching, a filename means
    restoring.

---

## 9. Going further

- **`git stash`** — shelve unfinished work without committing it. `git stash`,
  `git stash pop`, `git stash list`. Useful when someone asks you to look at something
  urgently and you're mid-thought.
- **`git blame style.css`** — who last changed each line, and in which commit. Badly named:
  most of the time you're using it to find the *context* for a line, not a culprit.
  `git log -S "max-width"` is its companion — every commit that added or removed that text.
- **Tags** — `git tag v1.0`, a permanent name for a commit. Useful when you want to be able
  to say "the version of this that was live when I applied for that job".
- **GitHub's compare view** — `github.com/you/repo/compare/main...redesign` shows the same
  thing as `git diff main` in a browser, with line comments. It's what a pull request is
  built on, which is [tutorial 4](../index.md).
- **`git rebase`** — replays your commits on top of another branch, producing a straight
  history rather than a merge commit. Genuinely useful and genuinely sharp; it rewrites
  history, so the pushed-versus-not rule from section 5 applies with force. Learn it after
  merging feels boring.
- **Git aliases** — the same idea as the shell aliases in
  [tutorial 2](02-too-big-for-excel.md#8-saving-the-answer-not-just-seeing-it), but git's
  own:

    ```bash
    git config --global alias.lg "log --oneline --graph --all"
    git config --global alias.st "status"
    ```

    Now `git lg` draws your branches as a graph, and `git st` saves you four characters a
    few thousand times.

---

## What you actually learned

- **Branches**: `switch -c`, `switch`, `branch`, `branch -d` / `-D`, `merge` — and the fact
  that a branch is a name pointing at a commit, not a copy of anything.
- **Reading history**: `log --oneline`, `log -- <file>`, `show`, `diff`, and what `HEAD`,
  `~1` and a hash mean.
- **Five undos**: which one to use depends on how far the mistake got, and the dividing line
  is whether you've pushed.
- **Merge conflicts**: what the markers mean, how to resolve one, and `--abort` when you'd
  rather not.
- **`git reflog`**: committed work is essentially never lost, even after `--hard`.

And the thing all of that adds up to: you can now try an idea on your own site without
first deciding whether it's going to work. That's what makes the difference between a site
you maintain and one you abandoned in August.

---

## Where to go next

If you haven't done **[the file too big for Excel](02-too-big-for-excel.md)** yet, that's
the other half of the terminal: pipes, `grep`, and getting a real answer out of 1.2 million
rows of genetics data.

Then **tutorial 4: fix something on this site** — the branch-and-merge you just did, but on
a repository other people read, with a review step in the middle. It isn't written yet; the
[roadmap](../index.md) has what's coming and in what order.

!!! question "Where did you get stuck?"

    If any step here was confusing, wrong, or missing something —
    [open an issue](https://github.com/katarinagresova/missing-skills/issues). The
    "when things go wrong" section above is built entirely out of those reports, and it's
    the most useful part of this page.
