class Node {
	constructor(data, priority) {
		this.data = data;
		this.priority = priority;
		this.parent = null;
		this.left = null;
		this.right = null;
	}

	appendChild(node) {
		if (this.left  != null && this.right != null)
			return;
		if (this.left === null){
			this.left = node;
			this.left.parent = this;
		}
		else{
			this.right = node;
			this.right.parent = this;
		}		
	}

	removeChild(node) {

		if (this.left === node) { 
			this.left = null; 
			node.parent = null; 
		} else
		if (this.right === node){ 
			this.right = null; 
			node.parent = null;
		} else 
			throw "Error - 'node' isn't a child of the 'this'.";
	
	}

	remove() {
		if (this.parent === null) return;
		this.parent.removeChild(this);
	}

//		0
//	   / \
//    2   -
//   / \
//  -   -
	swapWithParent() {
		if (this.parent === null) return;

		var parentOfParent = this.parent.parent;

		var	oldParent = this.parent,
			oldChild = this;

		var tempChild = {
			left: 	oldChild.left,
			right: 	oldChild.right
		}

		// updates parent.parent
		// maintains correct state of parent.parent.left and parent.parent.right
		if (parentOfParent != null){
			if (parentOfParent.left === oldParent) 	
				parentOfParent.left = oldChild;
			else 									
				parentOfParent.right = oldChild;
			oldChild.parent = parentOfParent;
		}// if parentOfParent === null => oldParent === root
		else{
			oldChild.parent = null;
		}


		if (oldParent.left === oldChild){
			oldChild.left = oldParent;
			oldChild.right = oldParent.right;

			if (oldChild.right != null) oldChild.right.parent = oldChild;
		}else{
			oldChild.right = oldParent;
			oldChild.left = oldParent.left;

			if (oldChild.left != null)  oldChild.left.parent = oldChild;
		}

		oldParent.parent = oldChild;
		oldParent.left = tempChild.left;
		oldParent.right = tempChild.right;

		if (tempChild.left  != null) tempChild.left.parent = oldParent;
		if (tempChild.right != null) tempChild.right.parent = oldParent;

	}
}
module.exports = Node;
