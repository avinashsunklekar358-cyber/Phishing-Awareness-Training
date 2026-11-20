'use strict';
const menu = document.getElementById('menu');
const nav = document.getElementById('navlinks');
menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); }));

const checks = [...document.querySelectorAll('[data-check]')];
const savedChecks = (() => { try { return JSON.parse(localStorage.getItem('phishshield-checks') || '[]'); } catch { return []; } })();
checks.forEach((input, i) => { input.checked = savedChecks[i] === true; input.addEventListener('change', updateChecks); });
function updateChecks(){
  const done = checks.filter(c => c.checked).length;
  document.getElementById('progressNum').textContent = done;
  document.getElementById('progressBar').style.width = `${done/checks.length*100}%`;
  document.getElementById('progressText').textContent = done === checks.length ? 'Great work! You reviewed every safety habit.' : `${checks.length-done} safety habits left to review.`;
  try { localStorage.setItem('phishshield-checks', JSON.stringify(checks.map(c => c.checked))); } catch {}
}
document.getElementById('resetChecklist').addEventListener('click', () => { checks.forEach(c => c.checked = false); updateChecks(); });
updateChecks();

const questions = [
 {q:'You receive an email saying your bank account will be locked in 10 minutes unless you click a link. What should you do?',a:['Click immediately to avoid losing access','Reply with your password','Open the bank’s official app or website independently','Forward the link to friends'],correct:2,why:'Urgent threats are a common phishing tactic. Verify the claim using the bank’s official app or a trusted address.'},
 {q:'Which statement about HTTPS and the padlock icon is correct?',a:['They guarantee the website is legitimate','They indicate an encrypted connection, not that the site is trustworthy','They mean the website cannot collect passwords','They guarantee that the domain belongs to your bank'],correct:1,why:'HTTPS encrypts the connection, but scammers can also use HTTPS on fraudulent websites.'},
 {q:'Someone claiming to be IT support asks you to share a one-time login code. What is the safest response?',a:['Share the code if they know your name','Share it only by text message','Post the code in a team chat','Do not share it; contact IT using a verified channel'],correct:3,why:'One-time codes are sensitive authentication information. Confirm support requests through official channels.'},
 {q:'Which is a common sign of a phishing email?',a:['An unexpected attachment and a request to act urgently','A message from a known contact about a planned meeting','A receipt for a purchase you just made from the official app','A newsletter you knowingly subscribed to'],correct:0,why:'Unexpected attachments and pressure to act quickly are warning signs, especially when the sender cannot be verified.'},
 {q:'You entered your password into a suspicious website. What should you do first?',a:['Wait a week to see whether anything happens','Use the official service to change the password and enable MFA','Send the password to support in an email','Delete your browser history and do nothing else'],correct:1,why:'Change the compromised password through the legitimate service immediately, enable MFA, and report the incident.'}
];
let index = 0, score = 0, answered = false;
const content = document.getElementById('quizContent');
const nextBtn = document.getElementById('nextBtn');
const feedback = document.getElementById('quizFeedback');
function renderQuestion(){
  answered = false; nextBtn.disabled = true; feedback.textContent = '';
  document.getElementById('questionCount').textContent = `QUESTION ${index+1} OF ${questions.length}`;
  document.getElementById('quizScore').textContent = `SCORE: ${score}`;
  document.getElementById('quizProgress').style.width = `${index/questions.length*100}%`;
  const item = questions[index];
  content.replaceChildren();
  const heading = document.createElement('h3'); heading.textContent = item.q; content.append(heading);
  const options = document.createElement('div'); options.className = 'options';
  item.a.forEach((answer, n) => {
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'option';
    const letter = document.createElement('span'); letter.className = 'letter'; letter.textContent = `${String.fromCharCode(65+n)}.`;
    btn.append(letter, document.createTextNode(answer));
    btn.addEventListener('click', () => choose(n)); options.append(btn);
  });
  content.append(options); nextBtn.textContent = index === questions.length-1 ? 'View results →' : 'Next question →';
}
function choose(choice){
  if(answered) return; answered = true;
  const item = questions[index];
  if(choice === item.correct) score++;
  [...content.querySelectorAll('.option')].forEach((button, n) => {
    button.disabled = true;
    if(n === item.correct) button.classList.add('correct');
    else if(n === choice) button.classList.add('wrong');
  });
  feedback.textContent = `${choice === item.correct ? '✓ Correct! ' : '✕ Not quite. '}${item.why}`;
  document.getElementById('quizScore').textContent = `SCORE: ${score}`;
  nextBtn.disabled = false;
}
function showResults(){
  document.getElementById('questionCount').textContent = 'QUIZ COMPLETE';
  document.getElementById('quizProgress').style.width = '100%';
  content.replaceChildren();
  const wrap = document.createElement('div'); wrap.className = 'quiz-result';
  const icon = document.createElement('div'); icon.className = 'result-icon'; icon.textContent = score >= 4 ? '🏆' : '🛡';
  const title = document.createElement('h3'); title.textContent = `You scored ${score} / ${questions.length}`;
  const msg = document.createElement('p'); msg.textContent = score === questions.length ? 'Excellent! You recognized all the phishing warning signs.' : score >= 3 ? 'Good effort! Review the explanations and keep practicing.' : 'Keep learning! Revisit the examples and try again.';
  wrap.append(icon,title,msg); content.append(wrap);
  feedback.textContent = 'You can retake the quiz as many times as you like.';
  nextBtn.disabled = false; nextBtn.textContent = 'Retake quiz ↺';
}
nextBtn.addEventListener('click', () => {
  if(index >= questions.length){index = 0;score = 0;renderQuestion();return;}
  if(!answered)return;
  index++;
  if(index === questions.length) showResults(); else renderQuestion();
});
renderQuestion();
