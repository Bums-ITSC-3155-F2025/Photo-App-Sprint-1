"use strict";

const crypto = require("crypto");

/**
 * Create a salted SHA-1 hash for the given password.
 * Returns { salt, hash } where salt is 16 hex chars and hash is 40 hex chars.
 */
function makePasswordEntry(password) {
  const salt = crypto.randomBytes(8).toString("hex"); // 16 chars
  const hash = crypto.createHash("sha1").update(password + salt).digest("hex"); // 40 chars
  return { salt, hash };
}

/**
 * Check whether the provided password matches the stored hash/salt pair.
 */
function doesPasswordMatch(hash, salt, password) {
  const candidate = crypto.createHash("sha1").update(password + salt).digest("hex");
  return candidate === hash;
}

module.exports = {
  makePasswordEntry,
  doesPasswordMatch
};
