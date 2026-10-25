# Canavar Kasabası — online, for two

The Halloween adventure of Vampire Bade and Bat Nehir, played together from two computers. Each girl controls her own hero; the story, lanterns and items are shared.

## Play
Open the site, choose a hero and leave the room code empty to create a room. Tell the code to your cousin; she enters the same code and picks the other hero.

- Arrows / WASD: walk · Space: inspect, talk, continue · M: private map (shows the cousin and any 📍 call)
- When one girl needs the other's power (something high, heavy, hidden or in the dark, the bat-only gaps), the cousin gets a 📻 call and a 📍 on her map.
- Shared moments need both girls together: the train to Monster Town, the clock-tower lantern (shoulder lift), the helicopter to the cloud giant, the last train home, and coming home to Funda, Başak and Duru. The cousin watches the same scene and reads along.
- Running out of hearts only sends that girl back to her last save point.
- Restarting the shared game needs one girl to ask and the other to confirm.

## For grown-ups
- `npm start` runs it locally (Node 20+, no dependencies). `npm test` plays the whole story with two simulated players.
- `python3 scripts/build.py` rebuilds `public/` from the single-player game sources in `reference/` plus `scripts/engine-bridge.js`.
- `render.yaml` describes one free Render web service. Rooms are saved to temporary storage, so saves may be lost when the free service restarts or redeploys.
