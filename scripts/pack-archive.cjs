// Read private input outside this repository. Output envelope + generated credential
// to the trusted orchestrator only; publish ONLY the envelope, never this full output.
const fs = require('node:fs');
const crypto = require('node:crypto');
const cipher = require('../archive-crypto.js');
(async () => {
  const [inputPath, credentialPath] = process.argv.slice(2);
  if (!inputPath) throw Error('Pass private prepared-member.json path');
  const source = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const password = credentialPath ? JSON.parse(fs.readFileSync(credentialPath, 'utf8')).password : crypto.randomBytes(18).toString('base64url');
  if (password.length < 24) throw Error('Use a randomly generated archive password of at least 24 characters');
  const payload = {schemaVersion:1, memberId:source.memberId, memberName:source.memberName, sourceCapturedAt:source.sourceCapturedAt,
    sessions:source.sessions.map(({memberId,number,workTitle,workDescription,workNote,workQuestions,importedAnswers,answerStatus}) =>
      ({memberId,number,workTitle,workDescription,workNote,workQuestions,importedAnswers,answerStatus})),
    supplementary:source.supplementary};
  const envelope = await cipher.encrypt(payload, password);
  const key = await cipher.derive(password, envelope, source.memberId);
  const restored = await cipher.decrypt(envelope, key, source.memberId);
  if (JSON.stringify(restored) !== JSON.stringify(payload)) throw Error('Round-trip mismatch');
  process.stdout.write(JSON.stringify({envelope, credential:{id:source.memberId,password}}));
})().catch(error => {console.error(error.message);process.exitCode=1;});
