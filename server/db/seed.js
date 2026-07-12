import bcrypt from "bcryptjs";
import db from "./connection.js";
import { makeId } from "../src/utils/id.js";

const PASSWORD = "password123";

function hash(pw) {
  return bcrypt.hashSync(pw, 10);
}

function makeUser({ email, name, role }) {
  const id = makeId("user");
  db.prepare(
    `INSERT INTO users (id, email, password_hash, role, name) VALUES (?, ?, ?, ?, ?)`
  ).run(id, email, hash(PASSWORD), role, name);
  return id;
}

console.log("Seeding database...");

db.exec(`
  DELETE FROM donor_messages;
  DELETE FROM documents;
  DELETE FROM donations;
  DELETE FROM case_updates;
  DELETE FROM case_timeline_steps;
  DELETE FROM cases;
  DELETE FROM donors;
  DELETE FROM patients;
  DELETE FROM hospitals;
  DELETE FROM users;
`);

// --- Hospitals -------------------------------------------------------------
const HOSPITAL_NAMES = ["City General Hospital", "Mayo Clinic", "Spaulding Rehab", "Berlin Medical"];
const hospitalIdByName = {};

for (const name of HOSPITAL_NAMES) {
  const userId = makeUser({
    email: `${name.toLowerCase().replace(/[^a-z]+/g, "")}@carebridge.dev`,
    name,
    role: "HOSPITAL",
  });
  const hospitalId = makeId("hosp");
  db.prepare(`INSERT INTO hospitals (id, user_id, name, verified) VALUES (?, ?, ?, 1)`).run(
    hospitalId,
    userId,
    name
  );
  hospitalIdByName[name] = hospitalId;
}

// --- Demo patient (linked to the first case below) --------------------------
const patientUserId = makeUser({ email: "patient@carebridge.dev", name: "Sarah", role: "PATIENT" });
const patientId = makeId("pat");
db.prepare(`INSERT INTO patients (id, user_id) VALUES (?, ?)`).run(patientId, patientUserId);

// --- Demo donor --------------------------------------------------------------
const donorUserId = makeUser({ email: "donor@carebridge.dev", name: "Marcus", role: "DONOR" });
const donorId = makeId("don");
db.prepare(`INSERT INTO donors (id, user_id) VALUES (?, ?)`).run(donorId, donorUserId);

// A couple of extra donors just so donor-count aggregates look real.
const extraDonorIds = ["Jane Doe", "The Miller Family", "Anonymous Donor"].map((name) => {
  const userId = makeUser({
    email: `${name.toLowerCase().replace(/[^a-z]+/g, "")}@carebridge.dev`,
    name,
    role: "DONOR",
  });
  const id = makeId("don");
  db.prepare(`INSERT INTO donors (id, user_id) VALUES (?, ?)`).run(id, userId);
  return { id, name };
});

// --- Cases -------------------------------------------------------------------
const insertCase = db.prepare(`
  INSERT INTO cases (
    id, hospital_id, patient_id, patient_name, condition, category, title, short_title,
    summary, story, hero_image, thumbnail, urgency, status, ai_match, goal, raised,
    ai_challenge, ai_solution
  ) VALUES (
    @id, @hospitalId, @patientId, @patientName, @condition, @category, @title, @shortTitle,
    @summary, @story, @heroImage, @thumbnail, @urgency, @status, @aiMatch, @goal, @raised,
    @aiChallenge, @aiSolution
  )
`);

const insertStep = db.prepare(`
  INSERT INTO case_timeline_steps (id, case_id, step_order, phase, status, title, detail)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertUpdate = db.prepare(`
  INSERT INTO case_updates (id, case_id, label, note, icon, created_at)
  VALUES (?, ?, ?, ?, ?, datetime('now', ?))
`);

const CASES = [
  {
    patientId,
    patientName: "Elara",
    condition: "Hypertrophic Cardiomyopathy",
    category: "Surgery",
    title: "Elara's Journey to a New Heart",
    shortTitle: "Emergency Cardiac Bypass",
    hospital: "City General Hospital",
    urgency: "CRITICAL",
    status: "ACTIVE",
    aiMatch: false,
    goal: 25000,
    raised: 12400,
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCI6hcGgXfAXDVyUt076BbaM_PBaeLgSssKrji36eOvEIUt1Njqk-CUX5bRKF3o9XuB61bhaIJfcnagKkiITcFjIWWMBh50iQeHvqINQz1VpQiblY3cG13dKY_7JVknwJJ4DeaaJ5u0k9W6tzNZo7TBCFROCm4NX9r-nhN0NGJXeI2-zD3g0u7Vq1TC7bQ4zEZ4cIrd3YjMPOqw_9SSZAOfCDCH5KOQ66ZontxLf-BHOS-EY6ArtVUY",
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-LO7KiM-bUkpRYnF9_24UZJP-7dr_vH7Oamojk8YY2rtKkHxBtQyFNWxYvFlulPjfqfpul6CG1pJycSwwhStjYjrYkB6HwXoIJOQdVEtsCfJ9Rjwn0g0cIXWGRDsubs0E889Fp5abK75-3Sds4SwNiQeFPocS8tNX03qyWG--R2bmn981vArlCXKq5YKQOFZXWsqlGTgzNJ9YwxY_hHj5pyA_S9uMxAI0aHatMDPoOBIJZQ5WSbPA",
    summary:
      "Elara requires urgent surgical intervention at City General. Her family has raised 40% of the costs.",
    story:
      "At just eight years old, Elara's world shrunk from the playground to a sterile hospital room. Diagnosed with a congenital heart defect that progressed rapidly into advanced heart failure, her only hope resides in a complex surgical intervention and a subsequent transplant.\n\nHer family, residents of the small suburban community served by City General, have exhausted their savings on preliminary treatments. CareBridge has stepped in to ensure that financial barriers do not stand between Elara and her chance at a full life.",
    aiChallenge:
      "The thickened heart muscle makes it harder for the heart to pump blood, causing severe fatigue and risk of failure.",
    aiSolution:
      "A specialized transplant and post-operative immunosuppression therapy to ensure long-term organ viability.",
    timeline: [
      { phase: "Phase 1: Stabilization", status: "complete", title: "Initial Hospitalization", detail: "Admitted to City General for cardiac monitoring and medication adjustment." },
      { phase: "Phase 2: Current Status", status: "current", title: "Transplant Registry & Pre-Op", detail: "Active on the donor list. Funding needed for the surgical team and specialized equipment." },
      { phase: "Phase 3: Post-Operative Care", status: "upcoming", title: "Rehabilitation & Recovery", detail: "Estimated 6-month intensive monitoring and physical therapy period." },
    ],
    updates: [
      { label: "Clinical Progress", note: "Elara's vital signs remain stable. The medical team has successfully optimized her fluid levels in preparation for the next stage of treatment. Her spirits are high.", icon: "check", agoModifier: "-2 days" },
      { label: "Lab Results", note: "Final compatibility screenings have been completed. All baseline metrics for surgery are now verified by the immunology department.", icon: "info", agoModifier: "-11 days" },
    ],
    documents: [
      { name: "Radiology Report", meta: "PDF • 2.4 MB", icon: "description" },
      { name: "Pre-Op Clearance", meta: "PDF • 1.1 MB", icon: "assignment" },
      { name: "Blood Labs", meta: "PDF • 840 KB", icon: "analytics" },
    ],
    messages: [
      { sender: "Jane Doe", message: "Stay strong, Sarah! We are all rooting for you. Sending prayers for a successful surgery.", agoModifier: "-2 hours" },
      { sender: "The Miller Family", message: "You've got this! Can't wait to see you back on your feet soon.", agoModifier: "-1 days" },
      { sender: "Anonymous Donor", message: "Sending strength and love from across the country.", agoModifier: "-2 days" },
    ],
  },
  {
    patientName: "Lina",
    condition: "Acute Lymphoblastic Leukemia",
    category: "Oncology",
    title: "Pediatric Oncology Regimen",
    shortTitle: "Pediatric Oncology Support",
    hospital: "Mayo Clinic",
    urgency: "MEDIUM",
    status: "ACTIVE",
    aiMatch: true,
    goal: 20000,
    raised: 8900,
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBrO1Bm9kjJxFM500rgAelbDvUi35BJrqn1-QM26lie4eAvcgiaoOGavv-VyJeZvGfzR2g8903fqrQKVwOYa7Hw4OwFOsHzMrBiu1zn2tqSo8U2erIs8MxGeaVhFGQDTy2wDgtlW_0Q638UlmJh1qcde92sRVq5AXaiUSlwn3GcA3zfGDWaWSgoHmc8kLjmP2olGTxC7_7MpJW-963hBdZXKEFU2JmX-fX4Fa7X6ssIGVoEEpOITsBF",
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2rbtknHJZGZRbsu-Xli_DQbnXrIi7CvrgRwIqFXiEw_8oHTxw-wb4jMDXUwxMxLsZuRCNVXQhrg2jNhcO_WbnlR3beI3OqYkzfuNJmrsLeqD3sHgC7nAWn0e2YqpdLi3VGuDvPvnsHxtWAbFHeSuBhpJZtHPDhtgdE3NeuIvOZNcwiF9aUp3JcD4p30Z9Gb_x_hJeqd1djZcs2ACicy-8DQBZ8B8ANtGZDV1nokaQCHzOOtwxi5g1",
    summary: "Lina's specialized treatment plan at St. Jude's affiliate requires specialized medication not covered by local insurance.",
    story:
      "Twelve-month advanced chemotherapy course for a pediatric patient. AI predicted high treatment efficacy based on genetic matching.\n\nLina's care team at Mayo Clinic has assembled a specialized regimen, but the medication itself sits outside standard insurance coverage.",
    aiChallenge: "Standard chemotherapy protocols have shown limited effect on this leukemia subtype.",
    aiSolution: "A twelve-month targeted regimen matched to Lina's genetic profile, administered under specialist supervision.",
    timeline: [
      { phase: "Phase 1: Diagnosis", status: "complete", title: "Genetic Matching Complete", detail: "Full genomic panel identified the optimal treatment regimen." },
      { phase: "Phase 2: Current Status", status: "current", title: "Treatment Funding", detail: "Raising funds for the twelve-month medication course." },
    ],
    updates: [
      { label: "Treatment Plan Approved", note: "Mayo Clinic's oncology board approved the genetic-matched regimen.", icon: "check", agoModifier: "-6 days" },
    ],
    documents: [],
    messages: [],
  },
  {
    patientName: "David",
    condition: "Post-Accident Rehabilitation",
    category: "Surgery",
    title: "Emergency Trauma Recovery",
    shortTitle: "Emergency Trauma Recovery",
    hospital: "Spaulding Rehab",
    urgency: "CRITICAL",
    status: "ACTIVE",
    aiMatch: false,
    goal: 36500,
    raised: 32100,
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDu7Sc6WiAIxSQmixPyuDOiPUfbNW7GlI7HJ1bwmbXzZ_c-k9-sHA_s6byRJyjvc6LfKM_iTquR2LR67w_6mNIZV_w7g7LugdxXefXGjVxOFeELgAO0Iy99W-ZcJY7DY3UihVYgtds7AkHKeoaypLLE2ACZ0gdD3QyLrzw_0V3CfPOxahamP34Bly3qe9Tdl6EQm9qbnVAMYK07kHqGmjGZfnYoDN9PPo4kuc-kPXS-b9Kp3HIdFzJo",
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDs7sILOK3OujboXT48-_4NHTIJhKfk2MLMgZD0ibnV1YqGVlbJXQPYbP9L-ODnvnB-mzq2rdn9Vi0Qdwb57Sv2QpJVTyIT8j9EAU3ke5cOqeKNzlYOVNZhvXkFAfOHvMSLyADqxiD2bijraAgIDUYszeD4jU31NVk1QG6cTuwlR5eaGQR6f0bjXacVeepNZmXXCqkh8CV1wEzBssxnXpnWwaHWxoP9x8OjW-d3cB7dXDqtM4dJazkH",
    summary: "Post-accident rehabilitation and prosthetic fitting for a community teacher. Vital for return to livelihood.",
    story:
      "David, a beloved community teacher, was involved in a serious accident that required emergency trauma care and now a custom prosthetic fitting.\n\nHis rehabilitation team at Spaulding is racing against a 48-hour funding window to secure the specialized exoskeleton equipment needed for his gait recovery.",
    aiChallenge: "Traditional prosthetics can't accommodate David's specific injury pattern.",
    aiSolution: "A custom-fitted exoskeleton-assisted rehabilitation program over 10 weeks.",
    timeline: [
      { phase: "Phase 1: Emergency Care", status: "complete", title: "Trauma Stabilization", detail: "Emergency surgery completed successfully." },
      { phase: "Phase 2: Current Status", status: "current", title: "Equipment Funding", detail: "48 hours remaining to fund the custom exoskeleton equipment." },
    ],
    updates: [
      { label: "Urgent Update", note: "Equipment supplier requires payment confirmation within 48 hours to hold the fitting slot.", icon: "warning", agoModifier: "-4 days" },
    ],
    documents: [],
    messages: [],
  },
  {
    patientName: "Omar",
    condition: "Post-Trauma Gait Recovery",
    category: "Medication",
    title: "Neuro-Rehabilitation Tech",
    shortTitle: "Neuro-Rehabilitation Tech",
    hospital: "Spaulding Rehab",
    urgency: "LOW",
    status: "ACTIVE",
    aiMatch: false,
    goal: 28500,
    raised: 26220,
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDs7sILOK3OujboXT48-_4NHTIJhKfk2MLMgZD0ibnV1YqGVlbJXQPYbP9L-ODnvnB-mzq2rdn9Vi0Qdwb57Sv2QpJVTyIT8j9EAU3ke5cOqeKNzlYOVNZhvXkFAfOHvMSLyADqxiD2bijraAgIDUYszeD4jU31NVk1QG6cTuwlR5eaGQR6f0bjXacVeepNZmXXCqkh8CV1wEzBssxnXpnWwaHWxoP9x8OjW-d3cB7dXDqtM4dJazkH",
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDs7sILOK3OujboXT48-_4NHTIJhKfk2MLMgZD0ibnV1YqGVlbJXQPYbP9L-ODnvnB-mzq2rdn9Vi0Qdwb57Sv2QpJVTyIT8j9EAU3ke5cOqeKNzlYOVNZhvXkFAfOHvMSLyADqxiD2bijraAgIDUYszeD4jU31NVk1QG6cTuwlR5eaGQR6f0bjXacVeepNZmXXCqkh8CV1wEzBssxnXpnWwaHWxoP9x8OjW-d3cB7dXDqtM4dJazkH",
    summary: "Post-trauma physical therapy using exoskeleton technology to assist in gait recovery and motor skill redevelopment.",
    story:
      "Omar's rehabilitation combines exoskeleton-assisted therapy with traditional physical therapy to rebuild motor pathways after a spinal trauma.",
    aiChallenge: "Traditional PT alone showed slow progress rebuilding motor pathways.",
    aiSolution: "Exoskeleton-assisted sessions three times weekly, supplementing standard PT.",
    timeline: [
      { phase: "Phase 1: Assessment", status: "complete", title: "Baseline Mobility Scan", detail: "Full gait analysis completed." },
      { phase: "Phase 2: Current Status", status: "current", title: "Equipment Access", detail: "92% funded — final push for exoskeleton session package." },
    ],
    updates: [],
    documents: [],
    messages: [],
  },
  {
    patientName: "Greta",
    condition: "Rare Autoimmune Condition",
    category: "Medication",
    title: "Targeted Immunotherapy",
    shortTitle: "Targeted Immunotherapy",
    hospital: "Berlin Medical",
    urgency: "HIGH",
    status: "ACTIVE",
    aiMatch: false,
    goal: 67000,
    raised: 27470,
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBDr4EqtLWR_FhRhFrgWonE_58hfk_Y8KBMTOcsER2skuVxKZBPC4v6GZr1tHlarRXBbNAsU_y-b65mLRm8J8N0xTQI8DMJEhG5dc0kIvXi2BYB4a_wKRfAmu8GOd-wJ1guEFVL_q1TeLM4_dDgYBfj6v_3_OUJ3lkjzo8grjnvkJDuf4vywiykEmVonmDl04wKdvfKIS5dkuO_29Opx7hZIS5JBwL9G4YYoyPqBHeQ687oybQmgthj",
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBDr4EqtLWR_FhRhFrgWonE_58hfk_Y8KBMTOcsER2skuVxKZBPC4v6GZr1tHlarRXBbNAsU_y-b65mLRm8J8N0xTQI8DMJEhG5dc0kIvXi2BYB4a_wKRfAmu8GOd-wJ1guEFVL_q1TeLM4_dDgYBfj6v_3_OUJ3lkjzo8grjnvkJDuf4vywiykEmVonmDl04wKdvfKIS5dkuO_29Opx7hZIS5JBwL9G4YYoyPqBHeQ687oybQmgthj",
    summary: "Experimental treatment course for rare autoimmune condition. Patient is pioneer in new clinical trial protocol.",
    story: "Greta is among the first patients approved for a new targeted immunotherapy protocol for her rare autoimmune condition.",
    aiChallenge: "Conventional immunosuppressants have stopped controlling symptom flare-ups.",
    aiSolution: "A new targeted biologic therapy, administered under a monitored clinical trial protocol.",
    timeline: [
      { phase: "Phase 1: Trial Enrollment", status: "complete", title: "Protocol Approval", detail: "Accepted into the targeted immunotherapy trial." },
      { phase: "Phase 2: Current Status", status: "current", title: "Treatment Funding", detail: "Raising funds for the first treatment cycle." },
    ],
    updates: [],
    documents: [],
    messages: [],
  },
  {
    patientName: "Samuel",
    condition: "Valvular Heart Disease",
    category: "Surgery",
    title: "Cardiac Valve Replacement",
    shortTitle: "Cardiac Valve Replacement",
    hospital: "City General Hospital",
    urgency: "HIGH",
    status: "ACTIVE",
    aiMatch: false,
    goal: 17200,
    raised: 12400,
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-LO7KiM-bUkpRYnF9_24UZJP-7dr_vH7Oamojk8YY2rtKkHxBtQyFNWxYvFlulPjfqfpul6CG1pJycSwwhStjYjrYkB6HwXoIJOQdVEtsCfJ9Rjwn0g0cIXWGRDsubs0E889Fp5abK75-3Sds4SwNiQeFPocS8tNX03qyWG--R2bmn981vArlCXKq5YKQOFZXWsqlGTgzNJ9YwxY_hHj5pyA_S9uMxAI0aHatMDPoOBIJZQ5WSbPA",
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-LO7KiM-bUkpRYnF9_24UZJP-7dr_vH7Oamojk8YY2rtKkHxBtQyFNWxYvFlulPjfqfpul6CG1pJycSwwhStjYjrYkB6HwXoIJOQdVEtsCfJ9Rjwn0g0cIXWGRDsubs0E889Fp5abK75-3Sds4SwNiQeFPocS8tNX03qyWG--R2bmn981vArlCXKq5YKQOFZXWsqlGTgzNJ9YwxY_hHj5pyA_S9uMxAI0aHatMDPoOBIJZQ5WSbPA",
    summary: "Samuel, 64, requires urgent surgical intervention at City General to replace a failing heart valve.",
    story: "Samuel, 64, requires urgent surgical intervention at City General to replace a failing heart valve.",
    aiChallenge: "Valve degradation has progressed to the point of restricting normal blood flow.",
    aiSolution: "Minimally invasive valve replacement surgery with a 6-week recovery window.",
    timeline: [
      { phase: "Phase 1: Diagnosis", status: "complete", title: "Cardiac Assessment", detail: "Full echocardiogram confirmed valve replacement is required." },
      { phase: "Phase 2: Current Status", status: "current", title: "Surgical Funding", detail: "72% funded toward the surgical team and materials." },
    ],
    updates: [],
    documents: [],
    messages: [],
  },
];

let seededActiveCaseId = null;

for (const c of CASES) {
  const id = makeId("case");
  insertCase.run({
    id,
    hospitalId: hospitalIdByName[c.hospital],
    patientId: c.patientId || null,
    patientName: c.patientName,
    condition: c.condition,
    category: c.category,
    title: c.title,
    shortTitle: c.shortTitle,
    summary: c.summary,
    story: c.story,
    heroImage: c.heroImage,
    thumbnail: c.thumbnail,
    urgency: c.urgency,
    status: c.status,
    aiMatch: c.aiMatch ? 1 : 0,
    goal: c.goal,
    raised: c.raised,
    aiChallenge: c.aiChallenge,
    aiSolution: c.aiSolution,
  });

  c.timeline.forEach((step, i) => {
    insertStep.run(makeId("step"), id, i + 1, step.phase, step.status, step.title, step.detail);
  });

  c.updates.forEach((u) => {
    insertUpdate.run(makeId("upd"), id, u.label, u.note, u.icon, u.agoModifier);
  });

  for (const doc of c.documents) {
    db.prepare(
      `INSERT INTO documents (id, case_id, name, meta, icon) VALUES (?, ?, ?, ?, ?)`
    ).run(makeId("doc"), id, doc.name, doc.meta, doc.icon);
  }

  for (const msg of c.messages) {
    db.prepare(
      `INSERT INTO donor_messages (id, case_id, sender_name, message, created_at) VALUES (?, ?, ?, ?, datetime('now', ?))`
    ).run(makeId("msg"), id, msg.sender, msg.message, msg.agoModifier);
  }

  if (c.patientId) seededActiveCaseId = id;
}

// --- Sample donations (so DonorDashboard + case donor counts look real) -----
const allCaseIds = db.prepare(`SELECT id, raised FROM cases`).all();
const insertDonation = db.prepare(
  `INSERT INTO donations (id, case_id, donor_id, amount, status, created_at) VALUES (?, ?, ?, ?, ?, datetime('now', ?))`
);

const demoGifts = [
  { caseIndex: 0, amount: 250, ago: "-1 days", status: "Active" },
  { caseIndex: 3, amount: 500, ago: "-12 days", status: "Funded" },
  { caseIndex: 5, amount: 150, ago: "-15 days", status: "Active" },
];
for (const gift of demoGifts) {
  const targetCase = allCaseIds[gift.caseIndex];
  insertDonation.run(makeId("gift"), targetCase.id, donorId, gift.amount, gift.status, gift.ago);
}

// A few more donations from the extra donors, spread across cases, so
// "donor count" per case isn't always 1.
allCaseIds.forEach((c, i) => {
  const donor = extraDonorIds[i % extraDonorIds.length];
  insertDonation.run(makeId("gift"), c.id, donor.id, 50 + i * 25, "Active", `-${i + 2} days`);
});

console.log("Seed complete.\n");
console.log("Demo accounts (all use password: " + PASSWORD + "):");
console.log("  Hospital: citygeneralhospital@carebridge.dev");
console.log("  Patient:  patient@carebridge.dev   (has an active case: Elara)");
console.log("  Donor:    donor@carebridge.dev");
