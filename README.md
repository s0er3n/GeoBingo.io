![image](https://user-images.githubusercontent.com/48496757/172946606-046630b6-5eae-43e4-a2e9-c06bb9d9ea2e.png)

# 🌎 [GeoBingo.io](https://geobingo.io/)
an open source multiplayer street view bingo game
# Socials

[Discord Server](https://discord.gg/9rsM72jKvj)
[Twitch Category](https://www.twitch.tv/directory/game/GeoBingo.io)
[TikTok](https://www.tiktok.com/@geobingo)
[YouTube](https://www.youtube.com/channel/UCEB92TvBTby2GeDyU2ak8Dg)
[Instagram](https://www.instagram.com/geobingo.io/)

my discord tag: **.soeren**

# Self hosting with docker-compose

1. Set the Environment Variables from .env.example (only VITE_GMAPSAPI is needed for the base game)

2. run `docker-compose up --build`

3. the game should be running on port 3000


# ⚡ How to run it yourself for development
- install node 20

- clone repository

- go into cloned directory

- install the dependencies 

`
npm install
`

## 🗺️ add google maps api key

get an api key https://developers.google.com/maps/documentation/javascript/get-api-key

create Frontend/.env file and paste in your api key like this: 

`
VITE_GMAPSAPI=YOURAPIKEY
`
## 🏁  run it 

make sure your are in the root of the project and write
`
npm run dev
`
open geobingo on http://localhost:3000 :)

# 🤔 Questions? Write me on discord or create an issue
