var $ = require('jquery');
var dbHandler = new window.dbHandler();
var Q = require('Q');
// var dbHandler = require('../modules/dbHandler.js');

function TreeView(container, conf){
	var self = this;
	this.container = container
		.addClass('tree_view')
		.on('click','li', function(e){
			e.stopPropagation();
			var box_path = self.getBoxPath($(this));
			if(conf.onSelection){
				conf.onSelection(box_path);
				// self.reflectActiveMailbox(box_path);
			}
		});
}
TreeView.prototype = {
	printTree: function(tree){
		console.log('TreeView - Print tree: '+tree);
		var self = this;
		var def = Q.defer();
		dbHandler.getMailboxTree()
			.then(function(tree){
				var html = self.getTreeHTML(tree);
				self.container
					.html(html)
					.find('.tree_view_item').each(function(){
						var box_path = self.getBoxPath($(this));
						$(this).attr('data-box-path', box_path);
					});
				self.reflectActiveMailbox('INBOX');
				def.resolve();
			})
			.catch(function(err){
				console.log(err);
			});
		return def.promise;
	},
	getTreeHTML: function(tree){
		console.log(tree);
		var s = '';
		printSubTree(tree);
		return s;
		function printSubTree(subtree){
			s += '<ul>';
			for(var i in subtree){
				if(subtree.hasOwnProperty(i)){
					s += '<li class="tree_view_item" data-box="'+i+'">'+
					'<img class="folder_icon" src="graphics/folder_icon.png"/>'+
					'<span>'+i+'</span>';
					printSubTree(subtree[i]);
					s += '</li>';
				}
			}
			s += '</ul>';
		}
	},
	getBoxPath: function(tree_view_item){
		var box_path = tree_view_item.data('box');
		var pars = tree_view_item.parents('li');
		for(var i=0;i<pars.length;i++){
			var par = $(pars[i]);
			if(!par.hasClass('tree_view_item')){
				break;
			}
			box_path = par.data('box') + '/' + box_path;
		}
		return box_path;
	},
	reflectActiveMailbox: function(box_path){
		console.log('Tree View - Reflect active mailbox: '+box_path);
		this.container.find('.selected')
			.removeClass('selected');
		var items = this.container.find('.tree_view_item');
		for(var i=0;i<items.length;i++){
			var item = $(items[i]);
			if(item.data('box-path') === box_path){
				item.addClass('selected');
				break;
			}
		}
	}
};
module.exports = TreeView;