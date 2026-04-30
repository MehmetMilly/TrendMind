# TrendMind Workspace Redesign Brief

You are being asked to rethink the UI and UX of an app called `TrendMind`.

I have attached for you a couple images of the current UI.

Do **not** start coding yet.

Your job is to:
- deeply analyze the current product situation
- think hard about the workspace experience
- research similar concepts, product flows, and interface patterns
- then produce a **strong, detailed, opinionated UI/UX redesign plan**

This is not a light polish task. Treat it like a serious product redesign problem.

---

## What TrendMind Is

`TrendMind` is an AI-powered campaign workspace for marketing campaign creation, currently focused on `X`.

The user enters a campaign brief, then the app moves through a staged workflow where AI agents collaborate to produce campaign outputs.

The intended campaign flow is roughly:

`Brief -> Research -> Strategy -> Drafting -> Image Generation -> Results`

The product is supposed to feel like a real workspace for campaign development, not like a chatbot with extra panels around it.

---

## General Situation

The current front-end has promise.

Some parts are genuinely strong:
- the overall workspace shell concept has potential
- the general visual direction feels premium and refined
- some individual UI sections and components look beautiful

But overall, the UI and UX are currently **not acceptable**.

The main issue is that the product does not feel intentional enough as a whole.

It feels too much like:
- many beautiful UI elements grouped together
- phase screens designed in isolation
- a visually impressive prototype that still lacks strong product logic
- a workspace that is trying to show off rather than work well

So even though some parts are good, the product experience still feels messy, unstructured, spatially inefficient, and not truly satisfying.

---

## Important Mindset For This Task

Please do **not** treat this as a request for:
- small edits
- spacing cleanup
- cosmetic polish
- surface-level UI beautification

Also, do **not** assume the current phase implementations should be preserved.

If your honest conclusion is that the current phase implementations should be mostly replaced or fundamentally rethought, say so clearly.

You are allowed to be bold.

You should think like a strong product designer and UX designer, not like someone protecting the current screens.

---

## The Main Problems

### 1. The current phase implementations need true rethinking

The existing phase screens should not be treated as precious.

I do **not** want a plan that mostly keeps the current phase implementations and just improves them slightly.

If necessary, assume they should be:
- heavily reworked
- structurally redesigned
- or partially / mostly discarded and rebuilt conceptually

I want real redesign thinking, not gentle cleanup.

### 2. The workspace wastes too much space

A major problem is poor use of space.

The app currently leaves too much valuable workspace area unused, especially in the main center canvas.

A clear example:
- the phase title and description area takes too much room
- large top sections consume space without giving enough functional value
- the layout often looks elegant but not efficient

This is a workspace product, so usable content area matters a lot.

You should strongly prioritize:
- maximizing usable canvas space
- reducing unnecessary vertical overhead
- reducing unnecessary horizontal waste
- increasing information efficiency
- preserving polish without sacrificing function

### 3. The right-side agents panel is ruining too much of the experience

The idea of an agents panel is useful.

The current implementation is not.

When open, it steals too much space from the main canvas and makes the central workspace feel squeezed and awkward, especially in richer phases like strategy or drafting.

It currently harms the product more than it helps.

You should rethink:
- what the panel should really be
- how much space it deserves
- whether it should have multiple states
- when it should be minimized, expanded, collapsed, or partially visible
- how it should behave across different phases
- how it should coexist with the main canvas without ruining the layout

### 4. The UX flow feels too manual and too passive

The current phase model behaves too much like a locked wizard.

That means the user waits for a stage, then clicks `Continue`, then moves to the next stage.

That feels too manual and not smart enough for an AI workspace.

The experience should feel more like:
- a live campaign workspace
- an intelligent system progressing through work
- a user supervising, steering, reviewing, and refining

It should feel less like:
- a slideshow
- a form wizard
- a sequence of manually advanced pages

### 5. The workspace is trying too hard to impress visually inside the wrong surface

The current interface sometimes feels too eager to show off.

That energy is misplaced.

In the future, the app will likely have a homepage or landing page.  
That is where more dramatic, expressive, or visually showy design ideas can live.

But the actual workspace should prioritize:
- clarity
- usability
- structure
- intentionality
- functional elegance
- strong spatial discipline

It should still look excellent, but it should look excellent as a serious product workspace, not as a design demo.

---

## Important Direction

I do **not** want you to be too restricted by my current assumptions.

Please feel free to:
- challenge the current interaction model
- challenge the current relationship between phases
- challenge the current role of the side panels
- challenge the current structure of the main canvas
- propose a better organizing idea for the whole workspace

You do **not** need to obey the current front-end as a design direction if you believe it is fundamentally limiting the product.

The goal is not to preserve the current UI.
The goal is to figure out what this workspace should become.

---

## What I Want You To Do

I want you to think deeply and come back with a **detailed redesign plan** for the UI and UX of TrendMind.

Before writing the plan, I want you to:
- analyze the product problem carefully
- reason about the product structurally, not just visually
- research similar concepts, patterns, and workflows
- learn from adjacent tools such as AI workspaces, creative workspaces, research-to-output flows, campaign planning tools, editorial tools, and productivity products
- use that research to improve your thinking, not to blindly imitate

I do **not** want a shallow answer.
I want real product thinking.

---

## What The Final Plan Should Cover

Your plan should explain:

- what is structurally wrong with the current UI
- what is structurally wrong with the current UX
- what should be kept
- what should be removed
- what should be simplified
- what should be redesigned from scratch
- what the overall workspace philosophy should become
- how the phase system should behave
- how `Image Generation` should fit between `Drafting` and `Results`
- how the center canvas should be redesigned to maximize space and usability
- how the right-side agents panel should behave
- how collapsed / expanded / minimized states should work
- how the layout should behave in different workflow states
- how the app should feel more intentional and less randomly assembled
- how to balance strong aesthetics with strong function
- how to reduce wasted space throughout the workspace
- how to make the workflow feel active, intelligent, and product-like

---

## What Not To Do

Please do **not**:
- jump straight into coding
- stay vague
- give generic design clichés
- solve the problem with tiny cosmetic tweaks
- assume the current phase implementations only need polish
- overfocus on decorative styling
- optimize for flashy visuals over product quality

---

## What To Optimize For

Please optimize for:
- strong product thinking
- strong UX reasoning
- clear workspace logic
- spatial efficiency
- intentional layout structure
- serious redesign judgment
- creative freedom where needed
- honesty about what is not working
- a result that feels like a real premium workspace product

---

## Output Request

Give me a **detailed, opinionated UI/UX redesign plan** in a PLAN.md file.

Do not write code yet.

Be bold, thoughtful, and honest.
