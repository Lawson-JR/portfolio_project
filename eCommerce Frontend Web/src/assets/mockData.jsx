import fc24 from "./images/fc24.jpeg"
import theLegendOfZeldaBreathOfTheWild from "./images/the-legend-of-zelda-breath-of-the-wild.jpg"
import theWitcherIIIWildHunt from "./images/the-witcher-3-wild-hunt.jpg"
import civilizationVI from "./images/civilization-vi.jpg"
import nba2k24 from "./images/nba-2k24.jpg"
import bayonetta3 from "./images/bayonetta-3.png"
import theSims4 from "./images/the-sims-4.jpg"
import noMansSky from "./images/no-mans-sky.png"
import farCry6 from "./images/far-cry-6.jpg"
import residentEvilVillage from "./images/resident-evil-village.png"
import godOfWar2018 from "./images/god-of-war-2018.jpg"
import sekiroShadowsDieTwice from "./images/sekiro-shadows-die-twice.jpg"
import finalFantasyVIIRemake from "./images/final-fantasy-vii-remake.jpg"
import citiesSkylines from "./images/cities-skylines.jpg"
import silentHill2 from "./images/silent-hill-2.jpg"
import aPlagueTaleInnocence from "./images/a-plague-tale-innocence.png"
import bloodborne from "./images/bloodborne.jpg"
import deathStranding from "./images/death-stranding.jpg"
import deadSpaceRemake from "./images/dead-space-remake.jpg"
import milesMorales from "./images/miles-morales.jpg"
import assassinsCreedValhalla from "./images/assassins-creed-valhalla.jpg"
import monsterHunterWorld from "./images/monster-hunter-world.png"
import footballManager2024 from "./images/football-manager-2024.jpg"
import outlast from "./images/outlast.jpg"
import theEvilWithin2 from "./images/the-evil-within-2.jpg"
import talesOfArise from "./images/tales-of-arise.jpg"
import tonyHawksProSkater12 from "./images/tony-hawks-pro-skater-1-2.jpg"
import alienIsolation from "./images/alien-isolation.jpg"
import slayTheSpire from "./images/slay-the-spire.jpg"
import subnautica from "./images/subnautica.jpg"
import maddenNfl24 from "./images/madden-nfl-24.jpg"
import devilMayCry5 from "./images/devil-may-cry-5.jpg"
import amnesiaTheDarkDescent from "./images/amnesia-the-dark-descent.jpg"
import frostpunk from "./images/frostpunk.jpg"
import massEffectLegendaryEdition from "./images/mass-effect-legendary-edition.jpg" 
import ghostOfTsushima from "./images/ghost-of-tsushima.jpg"
import phasmophohia from "./images/phasmophobia.jpg"
import redDeadRedemption2 from "./images/red-dead-redemption-2.jpg"
import pgaTour2k23 from "./images/pga-tour-2k23.jpg"
import doomEternal from "./images/doom-eternal.png" 
import horizonZeroDawn from "./images/horizon-zero-dawn.jpg"

export const Categories = [
    "Action",
    "Adventure",
    "Role Playing Games (R.P.G)",
    "Sports",
    "Simulation",
    "Strategy",
    "Horror",
    "Survival",
];

export const mockData = [
    // Top 8 Games
    { id: 1, image: fc24, name: "FC 24", price: "69.99", genre: "Sports", description: "Experience the thrill of FC 24 with improved gameplay, graphics, and realism."},
    { id: 2, image: theLegendOfZeldaBreathOfTheWild, name: "The Legend of Zelda: Breath of the Wild", price: "59.99", genre: "Action/Adventure", description: "Embark on an epic open-world journey as Link to save the kingdom of Hyrule."},
    { id: 3, image: theWitcherIIIWildHunt, name: "The Witcher 3: Wild Hunt", price: "39.99", genre: "R.P.G", description: "Explore a richly detailed fantasy world as Geralt of Rivia."},
    { id: 4, image: civilizationVI, name: "Civilization VI", price: "29.99", genre: "Strategy", description: "Lead your civilization from the Stone Age to the Information Age."},
    { id: 5, image: nba2k24, name: "NBA 2K24", price: "69.99", genre: "Sports", description: "The most realistic basketball experience awaits with NBA 2K24."},
    { id: 6, image: bayonetta3, name: "Bayonetta 3", price: "49.99", genre: "Action", description: "Battle angels and demons in the thrilling action-packed sequel."},
    { id: 7, image: farCry6, name: "Far Cry 6", price: "59.99", genre: "Adventure", description: "Fight for freedom in a tropical paradise ruled by a dictator."},
    { id: 8, image: milesMorales, name: "Spider-Man: Miles Morales", price: "49.99", genre: "Action", description: "Swing into action as Miles Morales, New York's newest Spider-Man."},

    // Remaining Games...
    { id: 9, image: noMansSky, name: "No Man's Sky", price: "59.99", genre: "Adventure/Survival", description: "Explore an infinite universe filled with procedurally generated worlds."},
    { id: 10, image: residentEvilVillage, name: "Resident Evil Village", price: "59.99", genre: "Horror", description: "Survive a terrifying village filled with horrors."},
    { id: 11, image: godOfWar2018, name: "God of War (2018)", price: "19.99", genre: "Action/Adventure", description: "Journey through Norse mythology with Kratos and Atreus."},
    { id: 12, image: sekiroShadowsDieTwice, name: "Sekiro: Shadows Die Twice", price: "49.99", genre: "Action", description: "Unravel a story of vengeance in feudal Japan."},
    { id: 13, image: finalFantasyVIIRemake, name: "Final Fantasy VII Remake", price: "39.99", genre: "R.P.G", description: "A reimagined classic, blending new mechanics with familiar characters."},
    { id: 14, image: citiesSkylines, name: "Cities: Skylines", price: "29.99", genre: "Simulation", description: "Design and manage the city of your dreams."},
    { id: 15, image: silentHill2, name: "Silent Hill 2", price: "19.99", genre: "Horror", description: "Explore the haunting town of Silent Hill in this psychological horror classic."},
    { id: 16, image: aPlagueTaleInnocence, name: "A Plague Tale: Innocence", price: "29.99", genre: "Adventure", description: "Survive a dark medieval world plagued by the Inquisition and rats."},
    { id: 17, image: bloodborne, name: "Bloodborne", price: "19.99", genre: "R.P.G", description: "Explore a gothic, nightmarish world filled with grotesque horrors."},
    { id: 18, image: deathStranding, name: "Death Stranding", price: "39.99", genre: "Action/Adventure", description: "Reconnect a broken world in this unique adventure from ideo Kojima."},
    { id: 19, image: deadSpaceRemake, name: "Dead Space (Remake)", price: "69.99", genre: "Horror", description: "Battle terrifying necromorphs aboard a derelict spaceship."},
    { id: 20, image: theSims4, name: "The Sims 4", price: "19.99", genre: "Simulation", description: "Create and control people in a virtual world."},
    { id: 21, image: assassinsCreedValhalla, name: "Assassin's Creed Valhalla", price: "39.99", genre: "Adventure", description: "Id and conquer Anglo-Saxon kingdoms as a Viking leader."},
    { id: 22, image: monsterHunterWorld, name: "Monster Hunter: World", price: "29.99", genre: "R.P.G", description: "Hunt down massive monsters in a beautifully crafted open world."},
    { id: 23, image: footballManager2024, name: "Football Manager 2024", price: "54.99", genre: "Simulation", description: "Manage your dream football team to victory."},
    { id: 24, image: outlast, name: "Outlast", price: "29.99", genre: "Horror", description: "Navigate an abandoned asylum filled with unspeakable horrors."},
    { id: 25, image: theEvilWithin2, name: "The Evil Within 2", price: "39.99", genre: "Horror", description: "Survive a twisted nightmare world in this survival horror game."},
    { id: 26, image: talesOfArise, name: "Tales of Arise", price: "59.99", genre: "R.P.G", description: "Embark on an epic journey to liberate two worlds from tyranny."},
    { id: 27, image: tonyHawksProSkater12, name: "Tony Hawk's Pro Skater 1+2", price: "49.99", genre: "Sports", description: "Skate through iconic levels in this remastered classic."},
    { id: 28, image: slayTheSpire, name: "Slay the Spire", price: "24.99", genre: "Strategy", description: "Climb the spire and build your deck in this roguelike card game."},
    { id: 29, image: alienIsolation, name: "Alien: Isolation", price: "39.99", genre: "Horror", description: "Evade a deadly alien while stranded on a space station."},
    { id: 30, image: subnautica, name: "Subnautica", price: "29.99", genre: "Adventure/Survival", description: "Explore an alien underwater world and uncover its mysteries."},
    { id: 31, image: maddenNfl24, name: "Madden NFL 24", price: "69.99", genre: "Sports", description: "Play the latest Madden with realistic gameplay and graphics."},
    { id: 32, image: devilMayCry5, name: "Devil May Cry 5", price: "29.99", genre: "Action", description: "Battle demons with stylish combat and a fast-paced story."},
    { id: 33, image: amnesiaTheDarkDescent, name: "Amnesia: The Dark Descent", price: "19.99", genre: "Horror", description: "Explore dark environments and solve puzzles while  iding horrific creatures."},
    { id: 34, image: frostpunk, name: "Frostpunk", price: "24.99", genre: "Survival/Strategy", description: "Lead your city through a frozen apocalypse in this strategy game."},
    { id: 35, image: massEffectLegendaryEdition, name: "Mass Effect Legendary Edition", price: "59.99", genre: "R.P.G", description: "Relive the epic space opera with all three games in one package."},
    { id: 36, image: ghostOfTsushima, name: "Ghost of Tsushima", price: "59.99", genre: "Action/Adventure", description: "Become a legendary samurai in this beautiful open-world adventure."},
    { id: 37, image: phasmophohia, name: "Phasmophobia", price: "14.99", genre: "Horror", description: "Team up with friends to investigate haunted locations and capture paranormal idence."},
    { id: 38, image: redDeadRedemption2, name: "Red Dead Redemption 2", price: "59.99", genre: "Action/Adventure", description: "Live the outlaw life in this sprawling open-world western."},
    { id: 39, image: pgaTour2k23, name: "PGA Tour 2K23", price: "59.99", genre: "Sports", description: "Master the game of golf with realistic mechanics and courses."},
    { id: 40, image: doomEternal, name: "Doom Eternal", price: "39.99", genre: "Action", description: "Battle the forces of hell in this fast-paced first-person shooter."},
    { id: 41, image: "", name: "F1 2023", price: "59.99", genre: "Sports", description: "Experience the adrenaline of Formula 1 racing."},
    { id: 42, image: "", name: "Elden Ring", price: "59.99", genre: "R.P.G", description: "Explore a vast open world filled with danger in this dark fantasy RPG."},
    { id: 43, image: "", name: "Life is Strange: True Colors", price: "39.99", genre: "Adventure", description: "Discover the power of empathy in this emotional narrative adventure."},
    { id: 44, image: "", name: "Uncharted 4: A Thief's End", price: "19.99", genre: "Adventure", description: "Follow Nathan Drake on one last adventure in search of lost treasure."},
    { id: 45, image: "", name: "Cyberpunk 2077", price: "59.99", genre: "R.P.G", description: "Explore a dystopian future in this sprawling open-world RPG."},
    { id: 46, image: "", name: "Two Point Hospital", price: "29.99", genre: "Simulation", description: "Build and manage your own hospital in this quirky simulation game."},
    { id: 47, image: "", name: "Monster Hunter: World", price: "29.99", genre: "R.P.G", description: "Hunt down massive monsters in an expansive open world."},
    { id: 48, image: "", name: "Dragon Quest XI", price: "39.99", genre: "R.P.G", description: "Embark on a journey to save the world in this classic RPG."},
    { id: 49, image: "", name: "MLB The Show 23", price: "59.99", genre: "Sports", description: "Step onto the diamond in the most realistic baseball simulation."},
    { id: 50, image: "", name: "Mass Effect Legendary Edition", price: "59.99", genre: "R.P.G", description: "Relive Commander Shepard's epic journey across the galaxy."},
    { id: 51, image: "", name: "Dark Souls III", price: "39.99", genre: "R.P.G", description: "Survive a challenging, dark fantasy world in this action RPG."},
    { id: 52, image: "", name: "Ori and the Will of the Wisps", price: "29.99", genre: "Adventure", description: "A beautiful and emotional platformer set in a mystical forest."},
    { id: 53, image: "", name: "Starfield", price: "69.99", genre: "R.P.G", description: "Explore the stars in Bethesda's latest space-faring RPG."},
    { id: 54, image: "", name: "Divinity: Original Sin 2", price: "44.99", genre: "R.P.G", description: "Experience deep tactical combat in this critically acclaimed RPG."},
    { id: 55, image: "", name: "Stardew Valley", price: "14.99", genre: "Simulation", description: "Build the farm of your dreams in this charming indie farming game."},
    { id: 56, image: "", name: "Hades", price: "24.99", genre: "Action", description: "Fight your way out of the underworld in this fast-paced roguelike."},
    { id: 57, image: "", name: "Kerbal Space Program", price: "39.99", genre: "Simulation", description: "Design and launch rockets in this space simulation."},
    { id: 58, image: "", name: "RollerCoaster Tycoon 3", price: "19.99", genre: "Simulation", description: "Create your dream amusement park in this classic simulation game."},
    { id: 59, image: "", name: "Farming Simulator 22", price: "39.99", genre: "Simulation", description: "Experience the challenges and rewards of modern farming."},
    { id: 60, image: "", name: "Crusader Kings III", price: "59.99", genre: "Strategy", description: "Rule your dynasty across generations in this grand strategy game."},
    { id: 61, image: "", name: "Tropico 6", price: "39.99", genre: "Simulation/Strategy", description: "Build and rule your island nation as the ultimate dictator."},
    { id: 62, image: "", name: "Anno 1800", price: "49.99", genre: "Simulation/Strategy", description: "Build a thriving industrial empire in the 19th century."},
    { id: 63, image: "", name: "XCOM 2", price: "19.99", genre: "Strategy", description: "Defend Earth from alien invaders in this tactical turn-based game."},
    { id: 64, image: "", name: "Total War: Three Kingdoms", price: "49.99", genre: "Strategy", description: "Experience the chaos of the Three Kingdoms period in China."},
    { id: 65, image: "", name: "StarCraft II", price: "39.99", genre: "Strategy", description: "Lead your faction to victory in this legendary real-time strategy game."},
    { id: 66, image: "", name: "Planet Coaster", price: "44.99", genre: "Simulation", description: "Build and manage your dream theme park with endless creativity."},
    { id: 67, image: "", name: "Red Dead Redemption", price: "59.99", genre: "Action/Adventure", description: "Experience life as an outlaw in the American West."},
    { id: 68, image: "", name: "WWE 2K23", price: "59.99", genre: "Sports", description: "Step into the ring and become a wrestling legend."},
    { id: 69, image: "", name: "Age of Empires IV", price: "59.99", genre: "Strategy", description: "Build and lead your empire through the ages in this RTS."},
    { id: 70, image: "", name: "Microsoft Flight Simulator", price: "59.99", genre: "Simulation", description: "Take to the skies in this ultra-realistic flight simulation game."},
    { id: 71, image: horizonZeroDawn, name: "Horizon Zero Dawn", price: "19.99", genre: "Action/Adventure", description: "Embark on a journey as Aloy to uncover the secrets of a world overrun by machines."},
    { id: 72, image: "", name: "RimWorld", price: "34.99", genre: "Simulation", description: "Build and manage a space colony on a distant planet." }
]