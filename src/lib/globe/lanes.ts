// The ring's tracks: every gateway event type falls into exactly one. Pure, so it can be checked:
// node scripts/lanes.check.mjs
export const LANES = ['messages', 'members', 'typing', 'moderation', 'reactions', 'voice', 'channels', 'servers', 'commands'] as const;
export type Lane = (typeof LANES)[number];

// order matters: the first rule that matches wins, and whatever matches none lands in "servers"
const RULES: [RegExp, Lane][] = [
	[/^INTERACTION_/, 'commands'],
	[/^MESSAGE_REACTION_/, 'reactions'],
	[/^MESSAGE_/, 'messages'],
	[/^TYPING_/, 'typing'],
	[/^(GUILD_MEMBER|GUILD_MEMBERS_|PRESENCE_|USER_)/, 'members'],
	[/^(GUILD_AUDIT_LOG_|GUILD_BAN_|AUTO_MODERATION_)/, 'moderation'],
	[/^(VOICE_|STAGE_INSTANCE_)/, 'voice'],
	[/^(CHANNEL_|THREAD_)/, 'channels']
];
export const laneOf = (type: string) => LANES.indexOf(RULES.find(([re]) => re.test(type))?.[1] ?? 'servers');

// the mark's ink, the same three as the globe's streaks: 1 a message, 2 an interaction, 0 everything else
export const inkOf = (type: string) => (type === 'INTERACTION_CREATE' ? 2 : type.startsWith('MESSAGE_') ? 1 : 0);

// the name shown in the caption: the type as Discord spells it, in plain letters
export const nameOf = (type: string) => type.toLowerCase().replaceAll('_', ' ');
