function getWorldName(worldType){
	var caveNameListA = ['Dark', 'Deep', 'Foreboding', 'Gloomy', 'Corrupt', 'Damp'];
	var caveNameListB = ['Cave', 'Cavern', 'Grotto', 'Den', 'Underdark', 'Hollow', 'Subterrane', 'Hideout', 'Hole'];

	var townListA = ['Vermilion', 'Fuchsia', 'Coumarine', 'Ambrette', 'Ragewharf', 'Lostwallow', 'Grimfort', 'Houndville', 'Fayglen', 'Oldshore'];
	var townListB = ['Town', 'Enclave', 'Refuge', 'Village', 'Retreat', 'Haven', 'Sanctuary'];

	var plainsListA = ['Wild', 'Lush', 'Verdant', 'Bountiful', 'Pleasant', 'Gentle'];
	var plainsListB = ['Plains', 'Fields', 'Grassland', 'Meadow', 'Prairie', 'Steppes', 'Pasture', 'Glen'];

	var mazeListA = ['Buried', 'Perilous', 'Sinister', 'Decrepit', 'Nefarious', 'Haunted', 'Spectral'];
	var mazeListB = ['Maze', 'Dungeon', 'Labyrinth', 'Mines', 'Vault', 'Tomb', 'Pit', 'Catacombs', 'Crypt', 'Lair'];

	if(worldType == 1){
		return mazeListA[Math.floor(Math.random() * mazeListA.length)] + " " + mazeListB[Math.floor(Math.random() * mazeListB.length)]
	}
	if(worldType == 2){
		return townListA[Math.floor(Math.random() * townListA.length)] + " " + townListB[Math.floor(Math.random() * townListB.length)]
	}
	if(worldType == 3){
		return plainsListA[Math.floor(Math.random() * plainsListA.length)] + " " + plainsListB[Math.floor(Math.random() * plainsListB.length)]
	}
	if(worldType == 4){
		return caveNameListA[Math.floor(Math.random() * caveNameListA.length)] + " " + caveNameListB[Math.floor(Math.random() * caveNameListB.length)]
	}
}