import db from "../../db/connection.js";
import { makeId } from "../utils/id.js";

export function createUser({ email, passwordHash, role, name, avatarUrl = null }) {
  const id = makeId("user");
  db.prepare(
    `INSERT INTO users (id, email, password_hash, role, name, avatar_url)
     VALUES (@id, @email, @passwordHash, @role, @name, @avatarUrl)`
  ).run({ id, email, passwordHash, role, name, avatarUrl });
  return findById(id);
}

export function findByEmail(email) {
  return db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);
}

export function findById(id) {
  return db.prepare(`SELECT * FROM users WHERE id = ?`).get(id);
}

export function createHospitalProfile(userId, name) {
  const id = makeId("hosp");
  db.prepare(`INSERT INTO hospitals (id, user_id, name) VALUES (?, ?, ?)`).run(id, userId, name);
  return getHospitalById(id);
}

export function createPatientProfile(userId) {
  const id = makeId("pat");
  db.prepare(`INSERT INTO patients (id, user_id) VALUES (?, ?)`).run(id, userId);
  return getPatientById(id);
}

export function createDonorProfile(userId) {
  const id = makeId("don");
  db.prepare(`INSERT INTO donors (id, user_id) VALUES (?, ?)`).run(id, userId);
  return getDonorById(id);
}

export function getHospitalById(id) {
  return db.prepare(`SELECT * FROM hospitals WHERE id = ?`).get(id);
}
export function getHospitalByUserId(userId) {
  return db.prepare(`SELECT * FROM hospitals WHERE user_id = ?`).get(userId);
}
export function getPatientById(id) {
  return db.prepare(`SELECT * FROM patients WHERE id = ?`).get(id);
}
export function getPatientByUserId(userId) {
  return db.prepare(`SELECT * FROM patients WHERE user_id = ?`).get(userId);
}
export function getDonorById(id) {
  return db.prepare(`SELECT * FROM donors WHERE id = ?`).get(id);
}
export function getDonorByUserId(userId) {
  return db.prepare(`SELECT * FROM donors WHERE user_id = ?`).get(userId);
}
