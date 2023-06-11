// @ts-check

/**
 * Created by richard.livingston on 18/02/2017.
 */

export default class JSONView {
 /**
  * @param {string} name_ 
  * @param {any} value_ 
  */
	constructor (name_, value_){
		var self = this;

		var name, value, type,
			domEventListeners = [], children = [], expanded = false;

		var dom = {
			container : document.createElement('div'),
			collapseExpand : document.createElement('div'),
			name : document.createElement('div'),
			separator : document.createElement('div'),
			value : document.createElement('div'),
			delete : document.createElement('div'),
			children : document.createElement('div'),
			insert : document.createElement('div')
		};


		Object.defineProperties(self, {

			dom : {
				value : dom.container,
				enumerable : true
			},

			name : {
				get : function(){
					return name;
				},

				set : setName,
				enumerable : true
			},

			value : {
				get : function(){
					return value;
				},

				set : setValue,
				enumerable : true
			},

			type : {
				get : function(){
					return type;
				},

				enumerable : true
			},

			refresh : {
				value : refresh,
				enumerable : true
			},

			collapse : {
				value : collapse,
				enumerable : true
			},

			expand : {
				value : expand,
				enumerable : true
			},

			destroy : {
				value : destroy,
				enumerable : true
			},
		});


		Object.keys(dom).forEach(function(k){
			var element = dom[k];

			if(k == 'container'){
				return;
			}

			element.className = k;
			dom.container.appendChild(element);
		});

		dom.container.className = 'jsonView';

		addDomEventListener(dom.collapseExpand, 'click', onCollapseExpandClick);
		addDomEventListener(dom.value, 'click', onCollapseExpandClick);
		addDomEventListener(dom.name, 'click', onCollapseExpandClick);

		setName(name_);
		setValue(value_);


		function refresh(){
			var expandable = type == 'object' || type == 'array';

			children.forEach(function(child){
				child.refresh();
			});

			dom.collapseExpand.style.display = expandable ? '' : 'none';

			if(expanded && expandable){
				expand();
			}
			else{
				collapse();
			}
		}


		function collapse(recursive){
			if(recursive){
				children.forEach(function(child){
					child.collapse(true);
				});
			}

			expanded = false;

			dom.children.style.display = 'none';
			dom.collapseExpand.className = 'expand';
			dom.container.classList.add('collapsed');
			dom.container.classList.remove('expanded');
		}


		function expand(recursive){
			var keys;

			if(type == 'object'){
				keys = Object.keys(value);
			}
			else if(type == 'array'){
				keys = value.map(function(v, k){
					return k;
				});
			}
			else{
				keys = [];
			}

			// Remove children that no longer exist
			for(var i = children.length - 1; i >= 0; i --){
				var child = children[i];

				if(keys.indexOf(child.name) == -1){
					children.splice(i, 1);
					removeChild(child);
				}
			}

			if(type != 'object' && type != 'array'){
				return collapse();
			}

			keys.forEach(function(key){
				addChild(key, value[key]);
			});

			if(recursive){
				children.forEach(function(child){
					child.expand(true);
				});
			}

			expanded = true;
			dom.children.style.display = '';
			dom.collapseExpand.className = 'collapse';
			dom.container.classList.add('expanded');
			dom.container.classList.remove('collapsed');
		}


		function destroy(){
			var child, event;

			while(event = domEventListeners.pop()){
				event.element.removeEventListener(event.name, event.fn);
			}

			while(child = children.pop()){
				removeChild(child);
			}
		}


		function setName(newName){
			var nameType = typeof newName;
			if(newName === name){
				return;
			}

			if(nameType != 'string' && nameType != 'number'){
				throw new Error('Name must be either string or number, ' + newName);
			}

			dom.name.innerText = newName;
			name = newName;
		}


		function setValue(newValue){
			var str;

			type = getType(newValue);

			switch(type){
				case 'null':
					str = 'null';
					break;
				case 'object':
					str = 'Object[' + Object.keys(newValue).length + ']';
					break;

				case 'array':
					str = 'Array[' + newValue.length + ']';
					break;

				default:
					str = newValue;
					break;
			}

			dom.value.innerText = str;
			dom.value.className = 'value ' + type;

			if(newValue === value){
				return;
			}

			value = newValue;

			refresh();
		}


		function addChild(key, val){
			var child;

			for(var i = 0, len = children.length; i < len; i ++){
				if(children[i].name == key){
					child = children[i];
					break;
				}
			}

			if(child){
				child.value = val;
			}
			else{
				child = new JSONView(key, val);
				children.push(child);
			}

			dom.children.appendChild(child.dom);

			return child;
		}


		function removeChild(child){
			if(child.dom.parentNode){
				dom.children.removeChild(child.dom);
			}

			child.destroy();
			child.removeAllListeners();
		}


		function getType(value){
			var type = typeof value;

			if(type == 'object'){
				if(value === null){
					return 'null';
				}

				if(Array.isArray(value)){
					return 'array';
				}
			}

			return type;
		}


		function onCollapseExpandClick(){
			if(expanded){
				collapse();
			}
			else{
				expand();
			}
		}


		function addDomEventListener(element, name, fn){
			element.addEventListener(name, fn);
			domEventListeners.push({element : element, name : name, fn : fn});
		}
	}
}