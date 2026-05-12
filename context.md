# Reference Material: Fellow Model, Rubric, KPIs, and Sample Data
### DeepThought — Software Developer Internship

This is the companion document to `assignment.md`. It contains the domain knowledge your tool needs to work correctly — the Fellow model, the rubric, the KPIs, and sample transcripts to test with.

---

## Part 1: The Fellow Model

### Who are DT Fellows?

DT Fellows are early-career professionals (0-3 years experience) placed inside client organizations for 3-6 month engagements. They work on the factory floor alongside the client's team.

### The Two Layers

A Fellow's work has two layers. **Your tool must assess both.**

**Layer 1 — Execution (visible work):**
- Attending meetings, tracking output, following up on delays
- Coordinating between departments
- Handling operational tasks — data entry, vendor calls, report preparation
- Being physically present and responsive

**Layer 2 — Systems building (the actual mandate):**
- Creating SOPs for recurring tasks
- Building trackers, dashboards, or workflows
- Designing accountability structures
- Documenting processes that continue working after the Fellow leaves

**The critical distinction:** Layer 1 is necessary. Layer 2 is the job. A Fellow who only does Layer 1 leaves no lasting value. Your tool should flag when a transcript only shows Layer 1 evidence.

### The Survivability Test

The simplest diagnostic: *If the Fellow left tomorrow, would any system they built continue running?* If yes → systems building. If no → task execution only.

---

## Part 2: The 8 KPIs

Every Fellow placement is tied to business outcomes. Your tool should identify which KPIs the Fellow's work connects to, based on the supervisor's description.

| KPI | What it measures | Supervisor might say... |
|-----|-----------------|----------------------|
| **Lead Generation** | New customers identified/contacted | "She finds new schools to partner with" |
| **Lead Conversion** | Leads that become paying customers | "He closed 3 new accounts this month" |
| **Upselling** | Selling more to existing customers | "Our existing clients are ordering bigger quantities" |
| **Cross-selling** | Selling additional products to existing customers | "We started supplying packaging along with the core product" |
| **NPS** | Customer satisfaction | "Our retailers are much happier now", "Fewer complaints" |
| **PAT** | Profitability | "We reduced waste", "Costs came down" |
| **TAT** | Turnaround time | "Dispatch is faster now", "We don't miss deadlines anymore" |
| **Quality** | Defect/rejection/complaint rates | "Rejection rate dropped", "Fewer customer complaints" |

Supervisors never use the term "KPI." They describe outcomes in plain language. Your LLM prompt needs to map their words to these categories.

---

## Part 4: Assessment Dimensions (for Gap Analysis)

When your tool analyzes a transcript, it should check whether the supervisor covered these 4 dimensions. If a dimension is missing, it's a gap that needs follow-up questions.

### Dimension 1: Driving Execution
Does the transcript mention whether the Fellow gets things done on time, follows up without reminders, initiates work?

### Dimension 2: Systems Building
Does the transcript mention anything the Fellow created — a tracker, a process, an SOP, a template — that others use or that would survive the Fellow's departure?

### Dimension 3: KPI Impact
Does the transcript connect the Fellow's work to any measurable business outcome (speed, quality, costs, customer satisfaction)?

### Dimension 4: Change Management
Does the transcript describe how the Fellow interacts with the floor team — getting people to adopt new processes, handling resistance, building rapport with workers who are older and more experienced?

**Change management is where most Fellows struggle.** A 23-year-old asking a 45-year-old machine operator to fill out a new checklist — the power dynamic is inverted and there's no formal authority. Your tool should flag when the transcript has no change management evidence.

---

## Part 5: Supervisor Biases Your Tool Should Account For

Supervisors are honest but biased. Your tool (or at minimum, your prompt) should be aware of:

1. **Helpfulness bias** — "She handles all my calls now" sounds like an 8, but it's actually a 5-6 (task absorption, not systems building)
2. **Presence bias** — "He's always on the floor" gets rated higher than "She spends time on the computer building trackers"
3. **Halo/horn effect** — one big story (positive or negative) coloring the entire assessment
4. **Recency bias** — supervisor remembers the last 2 weeks, not the full tenure

**In your prompt engineering:** You might instruct the model to identify when a supervisor's praise describes task absorption vs. systems building, or when a negative comment might actually indicate systems work the supervisor doesn't recognize.
