export const BADGES = [
  { level: 1, title: "🥉 Rookie", minRep: 0 },
  { level: 2, title: "🥈 Super Rookie", minRep: 100 },
  { level: 3, title: "⭐ Supernova", minRep: 500 },
  { level: 4, title: "⚔️ Vice Admiral", minRep: 1500 },
  { level: 5, title: "🛡️ Shichibukai", minRep: 4000 },
  { level: 6, title: "⚓ Admiral", minRep: 8000 },
  { level: 7, title: "🌊 Fleet Admiral", minRep: 15000 },
  { level: 8, title: "👑 Gorosei", minRep: 30000 },
  { level: 9, title: "🔥 Yonko", minRep: 60000 },
  { level: 10, title: "🏴‍☠️ Pirate King", minRep: 120000 },
]

export function getBadge(reputation) {
  let badge = BADGES[0]
  for (const b of BADGES) {
    if (reputation >= b.minRep) badge = b
  }
  return badge
}
