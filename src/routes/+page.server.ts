// Runs at prerender only, so the snapshot's points stay out of the page; the caption gets its three fields.
import { still, type Snapshot } from '#lib/globe/source.js';
import snapshot from '../../static/globe-snapshot.json';

export const load = () => ({ globe: still(snapshot as Snapshot) });
