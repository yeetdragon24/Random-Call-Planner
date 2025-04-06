!function(n,r,t,o,e,u){function a(n){var r,t=n.length,e=this,u=0,a=e.i=e.j=0,f=e.S=[];for(t||(n=[t++]);o>u;)f[u]=u++;for(u=0;o>u;u++)f[u]=f[a=g&a+n[u%t]+(r=f[u])],f[a]=r;(e.g=function(n){for(var r,t=0,u=e.i,a=e.j,f=e.S;n--;)r=f[u=g&u+1],t=t*o+f[g&(f[u]=f[a=g&a+r])+(f[a]=r)];return e.i=u,e.j=a,t})(o)}function f(n,r){for(var t,o=n+"",e=0;o.length>e;)r[g&e]=g&(t^=19*r[g&e])+o.charCodeAt(e++);return i(r)}function i(n){return String.fromCharCode.apply(0,n)}var c=t.pow(o,e),h=t.pow(2,52),$=2*h,g=o-1;t.seedrandom=function(u,g){var p=[],s=f(function n(r,t){var o,e=[],u=(typeof r)[0];if(t&&"o"==u)for(o in r)try{e.push(n(r[o],t-1))}catch(a){}return e.length?e:"s"==u?r:r+"\0"}(g?[u,i(r)]:0 in arguments?u:function t(e){try{return n.crypto.getRandomValues(e=new Uint8Array(o)),i(e)}catch(u){return[+new Date,n,n.navigator.plugins,n.screen,i(r)]}}(),3),p),v=new a(p);return f(i(v.S),r),t.random=function(){for(var n=v.g(e),r=c,t=0;h>n;)n=(n+t)*o,r*=o,t=v.g(1);for(;n>=$;)n/=2,r/=2,t>>>=1;return(n+t)/r},s},f(t.random(),r)}(this,[],Math,256,6,52);

function choose(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

var app = angular.module('myApp', ['ngMaterial']);
app.controller('myCtrl', function ($scope) {
	$scope.seed = ""
	$scope.save_string = ""
	
	$scope.lookahead = 200
	
	$scope.modes = [
		{id: 'grimoire', name: 'Grimoire', modName: 'Spell #', lookahead: 'Lookahead length', calls: 'Call #'},
		{id: 'clones', name: 'CMU', modName: 'Clone ID', lookahead: 'Clone amount', calls: 'Call '}
	];
	$scope.mode = $scope.modes[0]
	
	$scope.min_call = 0;
	$scope.max_call = 7;
	
	$scope.spellsCastTotal = 0
	$scope.spellsCastThisAscension = 0
	

	$scope.load_more = function () {
		$scope.lookahead += 50
		$scope.update_values()
	}


	$scope.print_scope = function () {
		console.log($scope);
	}

	$scope.load_game = function (str) {
		if (!str) {
			str = $scope.save_string;
		}
		str = str.split('!END!')[0];
		str = Base64.decode(str);
		str = str.split('|');
		spl = str[2].split(';');
		$scope.seed = spl[4];
		console.log($scope.seed);

		spl = str[4].split(';');
		$scope.ascensionMode = parseInt(spl[29]);
		console.log(spl);
		spl = str[5].split(';');
		console.log(spl[7]);

		$scope.spellsCastTotal = parseInt(spl[7].split(' ')[2]) || 0;
		console.log('Total spells cast: ' + $scope.spellsCastTotal);

		$scope.spellsCastThisAscension = parseInt(spl[7].split(' ')[1]) || 0;
		console.log('Spells cast this ascension: ' + $scope.spellsCastThisAscension);

		$scope.update_values();
	}

	$scope.update_values = function () {
		$scope.cookies = []
		$scope.randomSeeds = [];
		currentTime = Date.now();
		for (i = $scope.min_call - Number($scope.mode.id == 'grimoire'); i <= $scope.max_call - Number($scope.mode.id == 'grimoire'); i++) {
			currentSpell = i+$scope.spellsCastTotal;
			$scope.randomSeeds.push(check_randoms(currentSpell, $scope.lookahead));
		}
		$scope.starting_call = $scope.min_call;
		$scope.ending_call = $scope.max_call;
		
		$scope.last_mode = $scope.mode;
		
		//[...document.getElementsByClassName("md-no-sticky")].forEach(el => {
		//	el.style.setProperty('display', 'none', 'important');
		//}); //extreme skull
		
		console.log($scope.randomSeeds);
		console.log($scope.randomSeeds);
		console.log(Date.now()-currentTime);
	}

	$scope.collapse_interface = function (contentId) {
		console.log("content-" + contentId);
		if( contentId) {
			var content = document.getElementById("content-" + contentId);
			if (content.style.display === "block") {
				content.style.display = "none";
			} else {
				content.style.display = "block";
			}
		}
	}
	
	$scope.mode_change = function () {
		if ($scope.mode.id == 'clones') {
			$scope.lookahead = 43;
			$scope.min_call = 0;
			$scope.max_call = 30;
		}
		else {
			$scope.lookahead = 200;
			$scope.min_call = 0;
			$scope.max_call = 7;
		}
		$scope.update_values();
	}

	function choose(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	function check_randoms(modifier, amount) {
		Math.seedrandom($scope.seed + ($scope.mode.id == 'clones' ? ' clone ' : '/') + modifier);
		let randomValues = [];
		for (let i = 0; i < amount; i++) {
			value = Math.random();
			randomValues.push([value.toFixed($scope.mode.id == 'clones' ? 6 : (Math.max(Math.min(18-$scope.max_call+$scope.min_call, 8), 3))), value]);
		}
		return randomValues;
	}

	$scope.spells = {
		'conjure baked goods': {
			name: 'Conjure Baked Goods',
			desc: 'Summon half an hour worth of your CpS, capped at 15% of your cookies owned.',
			failDesc: 'Trigger a 15-minute clot and lose 15 minutes of CpS.',
			icon: [21, 11],
			costMin: 2,
			costPercent: 0.4,
			win: function () {
				var val = Math.max(7, Math.min(Game.cookies * 0.15, Game.cookiesPs * 60 * 30));
				Game.Earn(val);
				Game.Notify('Conjure baked goods!', 'You magic <b>' + Beautify(val) + ' cookie' + (val == 1 ? '' : 's') + '</b> out of thin air.', [21, 11], 6);
				Game.Popup('<div style="font-size:80%;">+' + Beautify(val) + ' cookie' + (val == 1 ? '' : 's') + '!</div>', Game.mouseX, Game.mouseY);
			},
			fail: function () {
				var buff = Game.gainBuff('clot', 60 * 15, 0.5);
				var val = Math.min(Game.cookies * 0.15, Game.cookiesPs * 60 * 15) + 13;
				val = Math.min(Game.cookies, val);
				Game.Spend(val);
				Game.Notify(buff.name, buff.desc, buff.icon, 6);
				Game.Popup('<div style="font-size:80%;">Backfire!<br>Summoning failed! Lost ' + Beautify(val) + ' cookie' + (val == 1 ? '' : 's') + '!</div>', Game.mouseX, Game.mouseY);
			},
		},
		'hand of fate': {
			name: 'Force the Hand of Fate',
			desc: 'Summon a random golden cookie. Each existing golden cookie makes this spell +15% more likely to backfire.',
			failDesc: 'Summon an unlucky wrath cookie.',
			icon: [22, 11],
			costMin: 10,
			costPercent: 0.6,
			failFunc: function (fail) {
				return fail + 0.15 * Game.shimmerTypes['golden'].n;
			},
			win: function () {
				var newShimmer = new Game.shimmer('golden', {noWrath: true});
				var choices = [];
				choices.push('frenzy', 'multiply cookies');
				if (!Game.hasBuff('Dragonflight')) choices.push('click frenzy');
				if (Math.random() < 0.1) choices.push('cookie storm', 'cookie storm', 'blab');
				if (Game.BuildingsOwned >= 10 && Math.random() < 0.25) choices.push('building special');
				//if (Math.random()<0.2) choices.push('clot','cursed finger','ruin cookies');
				if (Math.random() < 0.15) choices = ['cookie storm drop'];
				if (Math.random() < 0.0001) choices.push('free sugar lump');
				newShimmer.force = choose(choices);
				if (newShimmer.force == 'cookie storm drop') {
					newShimmer.sizeMult = Math.random() * 0.75 + 0.25;
				}
				Game.Popup('<div style="font-size:80%;">Promising fate!</div>', Game.mouseX, Game.mouseY);
			},
			fail: function () {
				var newShimmer = new Game.shimmer('golden', {wrath: true});
				var choices = [];
				choices.push('clot', 'ruin cookies');
				if (Math.random() < 0.1) choices.push('cursed finger', 'blood frenzy');
				if (Math.random() < 0.003) choices.push('free sugar lump');
				if (Math.random() < 0.1) choices = ['blab'];
				newShimmer.force = choose(choices);
				Game.Popup('<div style="font-size:80%;">Backfire!<br>Sinister fate!</div>', Game.mouseX, Game.mouseY);
			},
		},
		'stretch time': {
			name: 'Stretch Time',
			desc: 'All active buffs gain 10% more time (up to 5 more minutes).',
			failDesc: 'All active buffs are shortened by 20% (up to 10 minutes shorter).',
			icon: [23, 11],
			costMin: 8,
			costPercent: 0.2,
			win: function () {
				var changed = 0;
				for (var i in Game.buffs) {
					var me = Game.buffs[i];
					var gain = Math.min(Game.fps * 60 * 5, me.maxTime * 0.1);
					me.maxTime += gain;
					me.time += gain;
					changed++;
				}
				if (changed == 0) {
					Game.Popup('<div style="font-size:80%;">No buffs to alter!</div>', Game.mouseX, Game.mouseY);
					return -1;
				}
				Game.Popup('<div style="font-size:80%;">Zap! Buffs lengthened.</div>', Game.mouseX, Game.mouseY);
			},
			fail: function () {
				var changed = 0;
				for (var i in Game.buffs) {
					var me = Game.buffs[i];
					var loss = Math.min(Game.fps * 60 * 10, me.time * 0.2);
					me.time -= loss;
					me.time = Math.max(me.time, 0);
					changed++;
				}
				if (changed == 0) {
					Game.Popup('<div style="font-size:80%;">No buffs to alter!</div>', Game.mouseX, Game.mouseY);
					return -1;
				}
				Game.Popup('<div style="font-size:80%;">Backfire!<br>Fizz! Buffs shortened.</div>', Game.mouseX, Game.mouseY);
			},
		},
		'spontaneous edifice': {
			name: 'Spontaneous Edifice',
			desc: 'The spell picks a random building you could afford if you had twice your current cookies, and gives it to you for free. The building selected must be under 400, and cannot be your most-built one (unless it is your only one).',
			failDesc: 'Lose a random building.',
			icon: [24, 11],
			costMin: 20,
			costPercent: 0.75,
			win: function () {
				var buildings = [];
				var max = 0;
				var n = 0;
				for (var i in Game.Objects) {
					if (Game.Objects[i].amount > max) max = Game.Objects[i].amount;
					if (Game.Objects[i].amount > 0) n++;
				}
				for (var i in Game.Objects) {
					if ((Game.Objects[i].amount < max || n == 1) && Game.Objects[i].getPrice() <= Game.cookies * 2 && Game.Objects[i].amount < 400) buildings.push(Game.Objects[i]);
				}
				if (buildings.length == 0) {
					Game.Popup('<div style="font-size:80%;">No buildings to improve!</div>', Game.mouseX, Game.mouseY);
					return -1;
				}
				var building = choose(buildings);
				building.buyFree(1);
				Game.Popup('<div style="font-size:80%;">A new ' + building.single + '<br>bursts out of the ground.</div>', Game.mouseX, Game.mouseY);
			},
			fail: function () {
				if (Game.BuildingsOwned == 0) {
					Game.Popup('<div style="font-size:80%;">Backfired, but no buildings to destroy!</div>', Game.mouseX, Game.mouseY);
					return -1;
				}
				var buildings = [];
				for (var i in Game.Objects) {
					if (Game.Objects[i].amount > 0) buildings.push(Game.Objects[i]);
				}
				var building = choose(buildings);
				building.sacrifice(1);
				Game.Popup('<div style="font-size:80%;">Backfire!<br>One of your ' + building.plural + '<br>disappears in a puff of smoke.</div>', Game.mouseX, Game.mouseY);
			},
		},
		'haggler\'s charm': {
			name: 'Haggler\'s Charm',
			desc: 'Upgrades are 2% cheaper for 1 minute.',
			failDesc: 'Upgrades are 2% more expensive for an hour.<q>What\'s that spell? Loadsamoney!</q>',
			icon: [25, 11],
			costMin: 10,
			costPercent: 0.1,
			win: function () {
				Game.killBuff('Haggler\'s misery');
				var buff = Game.gainBuff('haggler luck', 60, 2);
				Game.Popup('<div style="font-size:80%;">Upgrades are cheaper!</div>', Game.mouseX, Game.mouseY);
			},
			fail: function () {
				Game.killBuff('Haggler\'s luck');
				var buff = Game.gainBuff('haggler misery', 60 * 60, 2);
				Game.Popup('<div style="font-size:80%;">Backfire!<br>Upgrades are pricier!</div>', Game.mouseX, Game.mouseY);
			},
		},
		'summon crafty pixies': {
			name: 'Summon Crafty Pixies',
			desc: 'Buildings are 2% cheaper for 1 minute.',
			failDesc: 'Buildings are 2% more expensive for an hour.',
			icon: [26, 11],
			costMin: 10,
			costPercent: 0.2,
			win: function () {
				Game.killBuff('Nasty goblins');
				var buff = Game.gainBuff('pixie luck', 60, 2);
				Game.Popup('<div style="font-size:80%;">Crafty pixies!<br>Buildings are cheaper!</div>', Game.mouseX, Game.mouseY);
			},
			fail: function () {
				Game.killBuff('Crafty pixies');
				var buff = Game.gainBuff('pixie misery', 60 * 60, 2);
				Game.Popup('<div style="font-size:80%;">Backfire!<br>Nasty goblins!<br>Buildings are pricier!</div>', Game.mouseX, Game.mouseY);
			},
		},
		'gambler\'s fever dream': {
			name: 'Gambler\'s Fever Dream',
			desc: 'Cast a random spell at half the magic cost, with twice the chance of backfiring.',
			icon: [27, 11],
			costMin: 3,
			costPercent: 0.05,
			win: function () {
				var spells = [];
				var selfCost = M.getSpellCost(M.spells['gambler\'s fever dream']);
				for (var i in M.spells) {
					if (i != 'gambler\'s fever dream' && (M.magic - selfCost) >= M.getSpellCost(M.spells[i]) * 0.5) spells.push(M.spells[i]);
				}
				if (spells.length == 0) {
					Game.Popup('<div style="font-size:80%;">No eligible spells!</div>', Game.mouseX, Game.mouseY);
					return -1;
				}
				var spell = choose(spells);
				var cost = M.getSpellCost(spell) * 0.5;
				setTimeout(function (spell, cost, seed) {
					return function () {
						if (Game.seed != seed) return false;
						var out = M.castSpell(spell, {cost: cost, failChanceMax: 0.5, passthrough: true});
						if (!out) {
							M.magic += selfCost;
							setTimeout(function () {
								Game.Popup('<div style="font-size:80%;">That\'s too bad!<br>Magic refunded.</div>', Game.mouseX, Game.mouseY);
							}, 1500);
						}
					}
				}(spell, cost, Game.seed), 1000);
				Game.Popup('<div style="font-size:80%;">Casting ' + spell.name + '<br>for ' + Beautify(cost) + ' magic...</div>', Game.mouseX, Game.mouseY);
			},
		},
		'resurrect abomination': {
			name: 'Resurrect Abomination',
			desc: 'Instantly summon a wrinkler if conditions are fulfilled.',
			failDesc: 'Pop one of your wrinklers.',
			icon: [28, 11],
			costMin: 20,
			costPercent: 0.1,
			win: function () {
				var out = Game.SpawnWrinkler();
				if (!out) {
					Game.Popup('<div style="font-size:80%;">Unable to spawn a wrinkler!</div>', Game.mouseX, Game.mouseY);
					return -1;
				}
				Game.Popup('<div style="font-size:80%;">Rise, my precious!</div>', Game.mouseX, Game.mouseY);
			},
			fail: function () {
				var out = Game.PopRandomWrinkler();
				if (!out) {
					Game.Popup('<div style="font-size:80%;">Backfire!<br>But no wrinkler was harmed.</div>', Game.mouseX, Game.mouseY);
					return -1;
				}
				Game.Popup('<div style="font-size:80%;">Backfire!<br>So long, ugly...</div>', Game.mouseX, Game.mouseY);
			},
		},
		'diminish ineptitude': {
			name: 'Diminish Ineptitude',
			desc: 'Spells backfire 10 times less for the next 5 minutes.',
			failDesc: 'Spells backfire 5 times more for the next 10 minutes.',
			icon: [29, 11],
			costMin: 5,
			costPercent: 0.2,
			win: function () {
				Game.killBuff('Magic inept');
				var buff = Game.gainBuff('magic adept', 5 * 60, 10);
				Game.Popup('<div style="font-size:80%;">Ineptitude diminished!</div>', Game.mouseX, Game.mouseY);
			},
			fail: function () {
				Game.killBuff('Magic adept');
				var buff = Game.gainBuff('magic inept', 10 * 60, 5);
				Game.Popup('<div style="font-size:80%;">Backfire!<br>Ineptitude magnified!</div>', Game.mouseX, Game.mouseY);
			},
		},
	};
	
});
