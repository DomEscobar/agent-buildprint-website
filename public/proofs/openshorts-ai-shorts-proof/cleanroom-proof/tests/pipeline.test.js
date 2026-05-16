import test from 'node:test';
import assert from 'node:assert/strict';
import products from '../fixtures/products.json' with { type: 'json' };
import { analyzeProduct, composeVideo, generateMediaTasks, generateScripts, publishManifest, runProduction, selectActor, synthesizeVoice } from '../src/pipeline.js';

test('analyzeProduct creates grounded product analysis from fixture', () => {
  const analysis = analyzeProduct(products[0]);
  assert.equal(analysis.productName, 'Agent Buildprint');
  assert.equal(analysis.painPoints.length, 3);
  assert.match(analysis.positioning, /founders/);
});

test('generateScripts emits exact five segment UGC structure', () => {
  const scripts = generateScripts(analyzeProduct(products[0]), { count: 2 });
  assert.equal(scripts.length, 2);
  for (const script of scripts) {
    assert.equal(script.durationSeconds, 25);
    assert.deepEqual(script.segments.map((s) => s.type), ['hook', 'problem', 'solution', 'demo', 'cta']);
    assert.equal(script.segments.filter((s) => s.visual === 'broll').length, 2);
    assert.ok(script.fullNarration.includes('Agent Buildprint'));
  }
});

test('actor upload is consent gated', () => {
  assert.equal(selectActor({ source: 'uploaded', imageUrl: 'mock://me.png' }).consentRequired, true);
  assert.equal(selectActor({ source: 'gallery' }).consentRequired, false);
  assert.throws(() => selectActor({ source: 'stolen' }), /invalid actor source/);
});

test('voiceover and media tasks model provider adapters without calling providers', () => {
  const analysis = analyzeProduct(products[0]);
  const [script] = generateScripts(analysis);
  const actor = selectActor({ source: 'generated' });
  const voice = synthesizeVoice(script);
  const tasks = generateMediaTasks(script, actor, voice, { mode: 'premium' });
  assert.equal(voice.artifact, `mock://audio/${script.id}.wav`);
  assert.equal(tasks.filter((t) => t.kind === 'talking_head')[0].provider, 'kling-avatar-adapter');
  assert.equal(tasks.filter((t) => t.kind === 'broll').length, 2);
  assert.equal(tasks.every((t) => t.status === 'mocked'), true);
});

test('composeVideo creates 9:16 video plan and timeline', () => {
  const analysis = analyzeProduct(products[1]);
  const [script] = generateScripts(analysis);
  const actor = selectActor();
  const voiceover = synthesizeVoice(script);
  const mediaTasks = generateMediaTasks(script, actor, voiceover);
  const video = composeVideo({ analysis, script, actor, voiceover, mediaTasks });
  assert.equal(video.format, '9:16');
  assert.equal(video.timeline.length, 5);
  assert.ok(video.ffmpegPlan.includes('burn subtitles'));
  assert.match(video.localUrl, /^\/videos\/video_/);
});

test('publishManifest exposes gallery SEO and social handoff', () => {
  const analysis = analyzeProduct(products[0]);
  const [script] = generateScripts(analysis);
  const actor = selectActor();
  const voiceover = synthesizeVoice(script);
  const video = composeVideo({ analysis, script, actor, voiceover, mediaTasks: generateMediaTasks(script, actor, voiceover) });
  const manifest = publishManifest(video, analysis, script, { social: ['manual', 'tiktok'] });
  assert.equal(manifest.seo.jsonLdType, 'VideoObject');
  assert.equal(manifest.gallery.status, 'ready');
  assert.deepEqual(manifest.publishing.map((p) => p.platform), ['manual', 'tiktok']);
});

test('runProduction performs end-to-end clean-room shorts pipeline', () => {
  const manifest = runProduction(products[0], { mode: 'lowcost', social: ['manual'] });
  assert.match(manifest.video.title, /Agent Buildprint/);
  assert.equal(manifest.video.timeline.length, 5);
  assert.equal(manifest.publishing[0].status, 'handoff');
});
