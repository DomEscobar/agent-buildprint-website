import crypto from 'node:crypto';

export const DEFAULT_VOICES = [
  { id: 'warm-founder', gender: 'female', language: 'en', style: 'authentic UGC' },
  { id: 'direct-operator', gender: 'male', language: 'en', style: 'clear demo' },
];

export function stableId(prefix, value) {
  return `${prefix}_${crypto.createHash('sha1').update(JSON.stringify(value)).digest('hex').slice(0, 10)}`;
}

export function analyzeProduct(input) {
  if (!input || (!input.url && !input.description)) throw new Error('url or description required');
  const name = input.name || hostname(input.url) || 'Product';
  const painPoints = normalizeList(input.painPoints, ['manual work is slow', 'existing tools are expensive', 'results are hard to explain']);
  const features = normalizeList(input.features, ['saves time', 'simplifies workflow', 'creates reusable output']);
  return {
    id: stableId('analysis', { name, description: input.description, url: input.url }),
    productName: name,
    url: input.url || null,
    oneLiner: input.description || `${name} helps its audience get work done faster.`,
    targetAudience: input.audience || 'busy operators',
    painPoints: painPoints.map((pain, i) => ({ pain, intensity: i === 0 ? 'high' : 'medium', emotionalTrigger: triggerFor(pain) })),
    keyFeatures: features,
    positioning: `A practical shortcut for ${input.audience || 'people'} who need ${features[0]}.`,
  };
}

export function generateScripts(analysis, { count = 3, style = 'ugc', language = 'en' } = {}) {
  if (!analysis?.productName) throw new Error('analysis required');
  return Array.from({ length: count }, (_, i) => {
    const pain = analysis.painPoints[i % analysis.painPoints.length];
    const feature = analysis.keyFeatures[i % analysis.keyFeatures.length];
    const title = `${analysis.productName}: ${pain.emotionalTrigger} angle ${i + 1}`;
    const segments = [
      { type: 'hook', visual: 'actor_talking', start: 0, end: 5, narration: `Stop losing time because ${pain.pain}.` },
      { type: 'problem', visual: 'broll', start: 5, end: 9, narration: `The old way feels messy and slow.`, brollPrompt: `frustrated person dealing with ${pain.pain}` },
      { type: 'solution', visual: 'actor_talking', start: 9, end: 16, narration: `${analysis.productName} gives you ${feature} without the usual chaos.` },
      { type: 'demo', visual: 'broll', start: 16, end: 21, narration: `Here is the workflow turning into a clear result.`, brollPrompt: `${analysis.productName} interface showing ${feature}` },
      { type: 'cta', visual: 'actor_talking', start: 21, end: 25, narration: `Try it once and see what changes.` },
    ];
    return {
      id: stableId('script', { analysis: analysis.id, title, i }),
      title,
      style,
      language,
      durationSeconds: 25,
      segments,
      fullNarration: segments.map((s) => s.narration).join(' '),
      caption: `${analysis.productName} turns a painful workflow into something simple. #aitools #productivity #shorts`,
    };
  });
}

export function selectActor({ source = 'gallery', prompt = 'friendly creator in a bright studio', imageUrl = null } = {}) {
  if (!['gallery', 'generated', 'uploaded'].includes(source)) throw new Error('invalid actor source');
  return { id: stableId('actor', { source, prompt, imageUrl }), source, prompt, imageUrl, consentRequired: source === 'uploaded' };
}

export function synthesizeVoice(script, voice = DEFAULT_VOICES[0]) {
  if (!script?.fullNarration) throw new Error('script required');
  return { id: stableId('voiceover', { script: script.id, voice }), voice, durationSeconds: script.durationSeconds, transcript: script.fullNarration, artifact: `mock://audio/${script.id}.wav` };
}

export function generateMediaTasks(script, actor, voiceover, { mode = 'lowcost' } = {}) {
  if (!['lowcost', 'premium'].includes(mode)) throw new Error('invalid mode');
  const tasks = [];
  tasks.push({ id: stableId('talking', { script: script.id, actor, mode }), kind: 'talking_head', provider: mode === 'premium' ? 'kling-avatar-adapter' : 'hailuo-veed-adapter', input: { actorId: actor.id, voiceoverId: voiceover.id }, status: 'mocked' });
  for (const seg of script.segments.filter((s) => s.visual === 'broll')) {
    tasks.push({ id: stableId('broll', { script: script.id, seg }), kind: 'broll', provider: 'image-video-adapter', input: { prompt: seg.brollPrompt, start: seg.start, end: seg.end }, status: 'mocked' });
  }
  tasks.push({ id: stableId('subtitle', script.id), kind: 'subtitles', provider: 'local-subtitle-renderer', input: { transcript: script.fullNarration }, status: 'mocked' });
  return tasks;
}

export function composeVideo({ analysis, script, actor, voiceover, mediaTasks }) {
  for (const required of [analysis, script, actor, voiceover, mediaTasks]) if (!required) throw new Error('missing composition input');
  const id = stableId('video', { analysis: analysis.id, script: script.id, actor: actor.id, voiceover: voiceover.id, mediaTasks });
  return {
    id,
    title: script.title,
    durationSeconds: script.durationSeconds,
    format: '9:16',
    localUrl: `/videos/${id}.mp4`,
    posterUrl: `/videos/${id}.jpg`,
    timeline: script.segments.map((segment) => ({ ...segment, assets: mediaTasks.filter((t) => segment.visual === 'broll' ? t.kind === 'broll' : t.kind === 'talking_head').map((t) => t.id) })),
    ffmpegPlan: ['normalize voiceover', 'trim talking-head', 'insert b-roll', 'burn subtitles', 'add hook overlay', 'export h264/aac mp4'],
  };
}

export function publishManifest(video, analysis, script, { gallery = true, social = ['manual'] } = {}) {
  return {
    id: stableId('manifest', video.id),
    video,
    seo: {
      slug: slugify(`${analysis.productName}-${script.title}`),
      title: `${analysis.productName} short video`,
      description: script.caption,
      jsonLdType: 'VideoObject',
      ogVideo: video.localUrl,
    },
    gallery: gallery ? { status: 'ready', page: `/video/${video.id}` } : { status: 'private' },
    publishing: social.map((platform) => ({ platform, status: platform === 'manual' ? 'handoff' : 'queued_mock', caption: script.caption, videoUrl: video.localUrl })),
  };
}

export function runProduction(input, options = {}) {
  const analysis = analyzeProduct(input);
  const [script] = generateScripts(analysis, { count: 1, style: options.style || 'ugc', language: options.language || 'en' });
  const actor = selectActor(options.actor || {});
  const voiceover = synthesizeVoice(script, options.voice || DEFAULT_VOICES[0]);
  const mediaTasks = generateMediaTasks(script, actor, voiceover, { mode: options.mode || 'lowcost' });
  const video = composeVideo({ analysis, script, actor, voiceover, mediaTasks });
  return publishManifest(video, analysis, script, { gallery: options.gallery ?? true, social: options.social || ['manual'] });
}

function normalizeList(value, fallback) {
  if (Array.isArray(value) && value.length) return value.map(String);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return fallback;
}
function hostname(url) { try { return url ? new URL(url).hostname.replace(/^www\./, '') : null; } catch { return null; } }
function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80); }
function triggerFor(pain) { return /time|slow|wait/i.test(pain) ? 'time-waste' : /expensive|cost|money/i.test(pain) ? 'money-loss' : 'frustration'; }
