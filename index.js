!function(n,r,t,o,e,u){function a(n){var r,t=n.length,e=this,u=0,a=e.i=e.j=0,f=e.S=[];for(t||(n=[t++]);o>u;)f[u]=u++;for(u=0;o>u;u++)f[u]=f[a=g&a+n[u%t]+(r=f[u])],f[a]=r;(e.g=function(n){for(var r,t=0,u=e.i,a=e.j,f=e.S;n--;)r=f[u=g&u+1],t=t*o+f[g&(f[u]=f[a=g&a+r])+(f[a]=r)];return e.i=u,e.j=a,t})(o)}function f(n,r){for(var t,o=n+"",e=0;o.length>e;)r[g&e]=g&(t^=19*r[g&e])+o.charCodeAt(e++);return i(r)}function i(n){return String.fromCharCode.apply(0,n)}var c=t.pow(o,e),h=t.pow(2,52),$=2*h,g=o-1;t.seedrandom=function(u,g){var p=[],s=f(function n(r,t){var o,e=[],u=(typeof r)[0];if(t&&"o"==u)for(o in r)try{e.push(n(r[o],t-1))}catch(a){}return e.length?e:"s"==u?r:r+"\0"}(g?[u,i(r)]:0 in arguments?u:function t(e){try{return n.crypto.getRandomValues(e=new Uint8Array(o)),i(e)}catch(u){return[+new Date,n,n.navigator.plugins,n.screen,i(r)]}}(),3),p),v=new a(p);return f(i(v.S),r),t.random=function(){for(var n=v.g(e),r=c,t=0;h>n;)n=(n+t)*o,r*=o,t=v.g(1);for(;n>=$;)n/=2,r/=2,t>>>=1;return(n+t)/r},s},f(t.random(),r)}(this,[],Math,256,6,52);

function choose(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

var app = angular.module('myApp', ['ngMaterial']);
app.controller('myCtrl', function ($scope) {
	$scope.seed = "aaaaa"
	$scope.seed_from_save = $scope.seed
	$scope.save_string = ""
	
	$scope.lookahead = 200
		
	$scope.modes = [
		{id: 'grimoire', name: 'Grimoire', modName: 'Spell #', sModName: 'Spell', lookahead: 'Lookahead length', calls: 'Call #', sCalls: '#'},
		{id: 'clones', name: 'CMU', modName: 'Clone ID', sModName: 'ID', lookahead: 'Clone amount', calls: 'Call ', sCalls: 'Call '}
	];
	$scope.mode = $scope.modes[0]
	
	$scope.min_call = 0;
	$scope.max_call = 10;
	$scope.sCT = 0;
	$scope.sCTA = 0;
	
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
		if (str.length == 5) {
			$scope.seed = str;
		}
		else {
			str = str.split('!END!')[0];
			str = Base64.decode(str);
			str = str.split('|');
			spl = str[2].split(';');
			$scope.seed = spl[4];
			$scope.seed_from_save = $scope.seed;
			console.log($scope.seed);

			spl = str[4].split(';');
			$scope.ascensionMode = parseInt(spl[29]);
			console.log(spl);
			spl = str[5].split(';');
			console.log(spl[7]);

			$scope.sCT = parseInt(spl[7].split(' ')[2]) || 0;
			console.log('Total spells cast: ' + $scope.spellsCastTotal);

			$scope.sCTA = parseInt(spl[7].split(' ')[1]) || 0;
			console.log('Spells cast this ascension: ' + $scope.spellsCastThisAscension);
		}
		$scope.update_values();
	}

	$scope.update_values = function () {
		$scope.cookies = []
		$scope.randomSeeds = [];
		currentTime = Date.now();
		
		$scope.spellsCastTotal = $scope.sCT;
		$scope.spellsCastThisAscension = $scope.sCTA;
		
		for (let i = 0; i < $scope.lookahead; i++) {
			currentSpell = i;
			if ($scope.mode.id == 'grimoire') currentSpell += $scope.spellsCastTotal;
			$scope.randomSeeds.push(check_randoms(currentSpell, $scope.min_call-1, $scope.max_call));
		}
		$scope.starting_call = $scope.min_call;
		$scope.ending_call = $scope.max_call;
		
		$scope.last_mode = $scope.mode;
		
		//[...document.getElementsByClassName("md-no-sticky")].forEach(el => {
		//	el.style.setProperty('display', 'none', 'important');
		//}); //extreme skull
		
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
			$scope.min_call = 6;
			$scope.max_call = 30;
		}
		else {
			$scope.lookahead = 200;
			$scope.min_call = 1;
			$scope.max_call = 10;
		}
		$scope.update_values();
	}

	function choose(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	function check_randoms(modifier, start, end) {
		const seed = $scope.seed + ($scope.mode.id == 'clones' ? ' clone ' : '/') + modifier;
		Math.seedrandom(seed);
		let randomValues = [];
		grimoireOffset = 0; Number($scope.mode.id == 'grimoire');
		for (let i = 0; i < start; i++) {
			Math.random(); //discarded values
		}
		for (let i = start+grimoireOffset; i < end+grimoireOffset; i++) {
			value = Math.random();
			randomValues.push([value.toFixed($scope.mode.id == 'clones' ? 6 : (Math.max(Math.min(18-$scope.max_call+$scope.min_call, 8), 5))), value]);
		}
		return randomValues;
	}
	
});
