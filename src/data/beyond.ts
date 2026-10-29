// Beyond the code copy from docs/CONTENT.md. Text will be tweaked later.
// No logos, game art, team crests, or real book covers anywhere in this section.

export const beyond = {
  heading: 'Beyond the code',
  hint: { desktop: 'Hover a card', touch: 'Tap a card' },

  cricket: {
    label: 'Cricket',
    title: 'Every Pakistan match, start to finish.',
    text: "I've watched for as long as I can remember. I don't get to play much anymore, but if the team is on, I'm watching, even on a second screen while I work.",
    reveal: 'World Cup season is the one time my calendar gets negotiable.',
    chips: ['TEAM · PAK', 'FORMAT · ALL', 'OVERS LEFT · ∞'],
  },

  gaming: {
    header: ['PLAYER 01', 'ONLINE · WEEKENDS'],
    title: 'Gaming and esports',
    list: [
      { term: 'Plays', value: 'PUBG Mobile, Tekken 8' },
      { term: 'Squad', value: 'Online friends' },
      { term: 'Watches', value: 'PUBG Mobile global events' },
      { term: 'Majors', value: 'Evo, EWC' },
    ],
    reveal: 'Truth is, I watch more esports than I play.',
  },

  events: {
    header: 'DEV EVENTS · KARACHI',
    passLabel: 'PASS',
    attendeeLabel: 'ATTENDEE',
    attendeeName: 'Abdullah Bin Nasir',
    text: "Started later than I should have. Now I go to learn, and to meet people I'll see again at the next one.",
    stickers: ['AI meetup', 'GitHub Copilot session', 'Freelancing session', 'First hackathon'],
  },

  reading: {
    label: 'Reading · currently',
    title: "A habit I'm still building.",
    text: "Some weeks I read twice, some months not at all. Right now it's The Art of Being Alone by Renuka Gavrani.",
    // Illustration text only, never the real cover. Update when the book changes.
    book: { title: 'The Art of Being Alone', author: 'Renuka Gavrani' },
  },
} as const;
