# Garden Gremlins

This is a stupid game built in a nextjs app that I made in a couple of days for my dads birthday. 

You can play it [here](thebirds.alfiefreeman.co.uk). For now. Until I have to pay.

It's pretty simple - move about with wasd and shoot birds with the spacebar. Don't get hit by falling shit. 

![Gameplay](/public/images/thebirdsgameplay.png)  

## Future Features
- difficulty settings
- new enemies to kill (squirrels and foxes)
- boss level enemies 
- player damage indicator (when hit)
- new levels to play with more interesting flight paths
- upgrades (better gun, new ships, movement speed etc)
- loading indicator (when level loading)
- better sprites (flapping wings etc, maybe)


## Fixes
- keypress logic isn't great, capslock will break your movement
- window size (game is 1000px * 1000px which doesn't fit on a lot of laptops (zoom out to play the game if necessary))
- bullet visibility is poor 


## Challenges

I had trouble with the performance at first. I am using a very old computer for a start, and then javascript isn't a great language for games I don't think! 

Originally I was calculating the next position of the birds during the game, but it was far too slow. All bird flight paths are now generated into a map before the game starts. I think it is quicker, but I might be wrong. 

The collisions, bullet paths, and shit paths are all still calculated in game. My computer can't handle more than 10 birds with a trigger happy gunman. I debounced the gun which helped a bit. 

The biggest challange is just I am not a game developer and I have no idea what I am doing. But that's also the fun part! 


------------------

Feel free to drop in a feature request or even open a PR and help me make it not so shit. 

## Setup Locally

To play the game locally just pull the repo, install with `npm i` and run `npm run dev`.
The game will appear in your browser at `localhost:3000` 
Bon chance
