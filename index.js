!function(n,r,t,o,e,u){function a(n){var r,t=n.length,e=this,u=0,a=e.i=e.j=0,f=e.S=[];for(t||(n=[t++]);o>u;)f[u]=u++;for(u=0;o>u;u++)f[u]=f[a=g&a+n[u%t]+(r=f[u])],f[a]=r;(e.g=function(n){for(var r,t=0,u=e.i,a=e.j,f=e.S;n--;)r=f[u=g&u+1],t=t*o+f[g&(f[u]=f[a=g&a+r])+(f[a]=r)];return e.i=u,e.j=a,t})(o)}function f(n,r){for(var t,o=n+"",e=0;o.length>e;)r[g&e]=g&(t^=19*r[g&e])+o.charCodeAt(e++);return i(r)}function i(n){return String.fromCharCode.apply(0,n)}var c=t.pow(o,e),h=t.pow(2,52),$=2*h,g=o-1;t.seedrandom=function(u,g){var p=[],s=f(function n(r,t){var o,e=[],u=(typeof r)[0];if(t&&"o"==u)for(o in r)try{e.push(n(r[o],t-1))}catch(a){}return e.length?e:"s"==u?r:r+"\0"}(g?[u,i(r)]:0 in arguments?u:function t(e){try{return n.crypto.getRandomValues(e=new Uint8Array(o)),i(e)}catch(u){return[+new Date,n,n.navigator.plugins,n.screen,i(r)]}}(),3),p),v=new a(p);return f(i(v.S),r),t.random=function(){for(var n=v.g(e),r=c,t=0;h>n;)n=(n+t)*o,r*=o,t=v.g(1);for(;n>=$;)n/=2,r/=2,t>>>=1;return(n+t)/r},s},f(t.random(),r)}(this,[],Math,256,6,52);

function choose(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

var app = angular.module('myApp', ['ngMaterial']);
app.controller('myCtrl', function ($scope) {
	$scope.seed = "aaaaa"
	$scope.seedFromSave = $scope.seed
	$scope.saveString = ""

    $scope.render = true;
	
	$scope.lookahead = 200
		
	$scope.modes = [
		{id: 'grimoire', name: 'Grimoire', modName: 'Spell #',  lookahead: 'Lookahead length', calls: 'Call #', sCalls: '#'},
		{id: 'clones', name: 'CMU', modName: 'Clone ID',  lookahead: 'Clone amount', calls: 'Call ', sCalls: 'Call '}
	];
	$scope.mode = $scope.modes[0]
	
	$scope.minCall = 1;
	$scope.maxCall = 10;
	$scope.sCT = 0;
	
	$scope.spellsCastTotal = 0
	$scope.spellsCastThisAscension = 0
	

	$scope.loadMore = function() {
		$scope.lookahead += 50;
		$scope.updateValues();
	}


	$scope.printScope = function() {
		console.log($scope);
	}

	$scope.loadGame = function(str) {
		if (!str) {
			str = $scope.saveString;
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
			$scope.seedFromSave = $scope.seed;
			console.log($scope.seed);

			spl = str[4].split(';');
			$scope.ascensionMode = parseInt(spl[29]);
			console.log(spl);
			spl = str[5].split(';');
			console.log(spl[7]);

			$scope.sCT = parseInt(spl[7].split(' ')[2]) || 0;
			console.log('Total spells cast: ' + $scope.spellsCastTotal);

			$scope.spellsCastThisAscension = parseInt(spl[7].split(' ')[1]) || 0;
			console.log('Spells cast this ascension: ' + $scope.spellsCastThisAscension);
		}
		$scope.updateValues();
	}

	$scope.updateValues = function () {
		$scope.randomSeeds = [];
		const currentTime = Date.now();
		
		$scope.spellsCastTotal = $scope.sCT;

        let table = new DocumentFragment();

        if ($scope.render) {
            var [lookaheadCol, lookaheadList] = createColumnItem($scope.mode.modName, true);
            lookaheadCol.id = 'lookaheadCol'
            
            table.append(lookaheadCol);
            table.append(document.createElement('md-divider'));

            var colEls = [];
            for (let i = $scope.minCall-1; i < $scope.maxCall; i++) {
                let els = createColumnItem(`Call #${i+1}`);
                table.append(els[0]);
                table.append(document.createElement('md-divider'));
                colEls[i] = els[1];
            }
        }
		
		for (let i = 0; i < $scope.lookahead; i++) {
            let start = Date.now();

			currentSpell = i;
			if ($scope.mode.id == 'grimoire') currentSpell += $scope.spellsCastTotal;

            if ($scope.render) {
                lookaheadList.appendChild(createListItem(`${$scope.spellsCastThisAscension + i} | ${$scope.spellsCastTotal + $scope.spellsCastThisAscension + i}`, true));
                lookaheadList.appendChild(document.createElement('md-divider'));
            }

            let seed = $scope.seed + ($scope.mode.id == 'clones' ? ' clone ' : '/') + currentSpell;
            Math.seedrandom(seed);
            let randomValues = [];
            for (let i = 0; i < $scope.minCall-1; i++) Math.random(); //discarded values
            for (let j = $scope.minCall-1; j < $scope.maxCall; j++) {
                let start = Date.now();

                value = Math.random();
                randomValues.push(value);

                if ($scope.render) {
                    colEls[j].appendChild(createListItem(value.toFixed(6)));
                    colEls[j].appendChild(document.createElement('md-divider'));
                }
            }

			$scope.randomSeeds.push(randomValues);

            //console.log(`Row ${i}: ${Date.now()-start}ms`);
		}

        document.getElementById('table').innerHTML = '';
        document.getElementById('table').appendChild(table);

		$scope.startingCall = $scope.minCall;
		$scope.endingCall = $scope.maxCall;

		
		$scope.lastMode = $scope.mode;
		
		//[...document.getElementsByClassName("md-no-sticky")].forEach(el => {
		//	el.style.setProperty('display', 'none', 'important');
		//}); //extreme skull
		console.log(`Total time: ${Date.now()-currentTime}ms`);

		console.log($scope.randomSeeds);
        window.randomSeeds = $scope.randomSeeds;
        console.log('The random seed array is accessible in the global variable "randomSeeds"');
		
	}

	$scope.collapseInterface = function (contentId) {
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
	
	$scope.modeChange = function () {
		if ($scope.mode.id == 'clones') {
			$scope.lookahead = 43;
			$scope.minCall = 6;
			$scope.maxCall = 30;
		}
		else {
			$scope.lookahead = 200;
			$scope.minCall = 1;
			$scope.maxCall = 10;
		}
		$scope.updateValues();
	}

    var listItem = (function() {
        let item = document.createElement('md-list-item');
        item.className = 'md-2-line _md-button-wrap _md md-clickable';
        item.role = 'listitem';
        item.tabIndex = '-1';
        
        let buttonCont = document.createElement('div');
        buttonCont.className = 'md-button md-no-style';

        let button = document.createElement('button');
        button.className = 'md-no-style md-button md-ink-ripple';
        button.type = 'button';
        button.setAttribute('ng-click', 'null');

        let outerCont = document.createElement('div');
        outerCont.className = 'md-list-item-inner';
        let innerCont = document.createElement('div');
        innerCont.className = 'md-list-item-text layout-column';
        innerCont.setAttribute('layout', 'column');

        let textEl = document.createElement('h3');

        innerCont.appendChild(textEl);
        outerCont.appendChild(innerCont);
        buttonCont.appendChild(button);
        buttonCont.appendChild(outerCont);
        item.appendChild(buttonCont);
        return item;
    })();
    function createListItem(text, lookaheadCol) {
        let item = listItem.cloneNode(true);
        item.classList.add(lookaheadCol ? 'lookaheadItem' : 'callItem');
        item.childNodes[0].childNodes[1].childNodes[0].textContent = text;
        return item;
    }

    var columnItem = (function() {
        let cont = document.createElement('div');

        let callOuterCont = document.createElement('md-toolbar');
        callOuterCont.setAttribute('layout', 'row');
        callOuterCont.className = 'md-hue-3 _md layout-row _md-toolbar-transitions colHeader';

        let callInnerCont = document.createElement('div');
        callInnerCont.className = 'md-toolbar-tools';

        let callText = document.createElement('h1');

        let listCont = document.createElement('md-content');
        listCont.class = '_md';

        let listEl = document.createElement('md-list');
        listEl.setAttribute('flex', '');
        listEl.setAttribute('role', 'list');
        listEl.className = 'flex';

        callInnerCont.appendChild(callText);
        callOuterCont.appendChild(callInnerCont);
        listCont.appendChild(listEl);
        cont.appendChild(callOuterCont);
        cont.appendChild(listCont);
        return cont;
    })();
    function createColumnItem(text, lookaheadCol) {
        let item = columnItem.cloneNode(true);
        item.className = lookaheadCol ? 'flex-gt-sm-15' : 'flex-gt-sm-80';
        item.childNodes[0].childNodes[0].childNodes[0].textContent = text;
        return [item, item.childNodes[1].childNodes[0]]
    }
});
