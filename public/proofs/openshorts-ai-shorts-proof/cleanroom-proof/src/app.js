import products from '../fixtures/products.json' with { type: 'json' };
import { analyzeProduct, generateMediaTasks, generateScripts, publishManifest, selectActor, synthesizeVoice, composeVideo } from './pipeline.js';

const $ = (id) => document.getElementById(id);

function render() {
  const input = products[Math.floor(Math.random() * products.length)];
  const analysis = analyzeProduct(input);
  const [script] = generateScripts(analysis);
  const actor = selectActor({ source: 'generated', prompt: `friendly creator for ${analysis.productName}` });
  const voiceover = synthesizeVoice(script);
  const mediaTasks = generateMediaTasks(script, actor, voiceover, { mode: 'lowcost' });
  const video = composeVideo({ analysis, script, actor, voiceover, mediaTasks });
  const manifest = publishManifest(video, analysis, script, { social: ['manual', 'instagram', 'youtube'] });

  $('analysis').textContent = JSON.stringify({ productName: analysis.productName, audience: analysis.targetAudience, pains: analysis.painPoints, features: analysis.keyFeatures }, null, 2);
  $('segments').innerHTML = script.segments.map((s) => `<li><b>${s.type}</b> <span>${s.start}-${s.end}s</span><p>${s.narration}</p>${s.brollPrompt ? `<code>${s.brollPrompt}</code>` : ''}</li>`).join('');
  $('jobs').innerHTML = mediaTasks.map((t) => `<li><b>${t.kind}</b><span>${t.provider}</span><code>${t.status}</code></li>`).join('');
  $('manifest').textContent = JSON.stringify(manifest, null, 2);
}

$('run').addEventListener('click', render);
render();
