import { createHash, createHmac } from "node:crypto";

function addTimeToNow({ days = 0, hour = 0, minute = 0, second = 0 }: { days?: number, hour?: number, minute?: number, second?: number }): string {
  const millisecond = ((((days) * 24 + hour) * 60 + minute) * 60 + second) * 1000

  return new Date(new Date().getTime() + millisecond).toISOString().slice(0, -5) + "Z"
}

function addTimeToDate(oldDate: string | Date, { days = 0, hour = 0, minute = 0, second = 0 }: { days?: number, hour?: number, minute?: number, second?: number }): string {
  if (typeof oldDate == 'string')
    oldDate = new Date(oldDate)

  const millisecond = ((((days) * 24 + hour) * 60 + minute) * 60 + second) * 1000

  return new Date(oldDate.getTime() + millisecond).toISOString().slice(0, -5) + "Z"
}

function validateSignature(payload: string, signature: string, secret: string) {
  const digest = createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return signature === digest
}

function calculateHash(payload: string) {
  const hash = createHash('sha256');
  hash.update(payload);
  return hash.digest('hex')
}

function calculateChecksum(payload: string, apiEndpoint: string, salt: { key: string, index: string }) {
  return calculateHash(payload + apiEndpoint + salt.key) + "###" + salt.index;
}

function validateChecksum(payload: string, salt: { key: string, index: string }, checksum: string) {
  return (calculateHash(payload + salt.key) + "###" + salt.index) === checksum;
}

export {
  addTimeToNow, addTimeToDate, validateSignature,
  calculateHash, calculateChecksum, validateChecksum
};
