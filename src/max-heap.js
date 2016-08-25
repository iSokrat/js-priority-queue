const Node = require('./node');

class MaxHeap {
	constructor() {
		this.root = null;
		this.parentNodes = [];
		this.countOfElements = 0;
	}

	push(data, priority) {
		const newNode = new Node(data,priority);
		this.insertNode( newNode );
		
		this.shiftNodeUp( newNode );

		++this.countOfElements;	
	}

	pop() {	
		if (this.root === null) return;

		
		var detached = this.detachRoot();

		// if detached is a single item in heap
		// then clear a heap
		let isDetachedWithoutChildren = (detached.left === null && detached.right === null);
		
		if (isDetachedWithoutChildren){
			this.clear();
			return detached.data;
		}
		
		this.restoreRootFromLastInsertedNode(detached);
		this.shiftNodeDown(this.root);

		--this.countOfElements;

		return detached.data;
	}

	detachRoot() {

		if (this.root === null) return;
		
		if ( this.root.left  === null ||
			 this.root.right === null )
			this.parentNodes.shift();

		const  detachedRoot = this.root;
		
		if (this.root.left != null)  this.root.left.parent  = null;
		if (this.root.right != null) this.root.right.parent  = null;

		this.root = null;

		return detachedRoot;
			
	}

	restoreRootFromLastInsertedNode( detached ) {

		// for test "calls restoreRootFromLastInsertedNode with detached root"
		if ( Object.keys(detached).length === 0 ) return;

		// find last element	

			// use BFS
		var queue = [ detached ];

		var currentNode = null;
		
		while (queue.length != 0){
			currentNode = queue.shift();
				
			if ( currentNode.left != null )  queue.push(currentNode.left); 
			else { break; } 

			if ( currentNode.right != null ) queue.push(currentNode.right);
			else { break; } 
		}

		var lastNode = currentNode;


			// if the queue with a nodes isn't empty then
			// change the lastNode to the last item in the queue
		if (queue.length != 0)
			lastNode = queue[queue.length-1];

		// restore the root from lastNode
		
		
		const oldRoot = detached;
		
		lastNode.remove();
		
		lastNode.parent = oldRoot.parent;
		
		if (oldRoot.left === lastNode){
			lastNode.left = null;
			lastNode.right = oldRoot.right;
		}else
		if (oldRoot.right === lastNode){
			lastNode.left = oldRoot.left;
			lastNode.right = null;
		}else{
			lastNode.left = oldRoot.left;
			lastNode.right = oldRoot.right;
		}
		
		this.root = lastNode;

		// ??? 
		if (oldRoot.left  != null)  oldRoot.left.parent = lastNode;
		if (oldRoot.right != null)  oldRoot.right.parent = lastNode;
		

		// AHTUNG!!! duct tape (наш костыль), 
		// I did not understand now, why it work 
		this.root.parent = null;

		// maintains correct state of parentNodes

		// remove lastElement from the queue and
		// push_front in parentNodes
		this.parentNodes.pop();
		if ( this.root.left  === null ||
			 this.root.right === null )
			this.parentNodes.unshift(lastNode);
	}

	size() {
		return this.countOfElements;
	}

	isEmpty() {
		if (this.root === null)
			return true;
		return false;
	}

	clear() {
		this.root = null;
		this.parentNodes = [];
		this.countOfElements = 0;
	}

	insertNode(node) {
		if (this.root === null){
			this.root = node;
			this.parentNodes.push(node);
			return;
		}
		// BFS
		var queue = [ this.root ];

		var currentNode = null;

		// Find place for new node
		while (queue.length != 0){
			currentNode = queue.shift();
			
			if (currentNode.left != null ) queue.push(currentNode.left); 
			else { currentNode.appendChild(node) ; break; } 

			if (currentNode.right != null ) queue.push(currentNode.right);
			else { currentNode.appendChild(node) ; break; } 
		}

		// Set parentNodes
		this.parentNodes.push(node);

		// if the new node is the right child for its parent - 
		// remove first item from parentNodes
		
		if (node.parent.right === node)
			this.parentNodes.shift();
	}

	shiftNodeUp(node) {
		if (node === this.root) 
			return;

		if (node.priority <= node.parent.priority) 
			return;
				

		// Set parentNodes in correct state
		
		// 1. Find node in parentNodes
		
		var numOfFoundNode = null;
		for (var i = this.parentNodes.length-1 ; 
				 i >= 0;
				 i--)
			if (this.parentNodes[i] === node){
				numOfFoundNode = i;
				break;
			}
		
		if ( this.parentNodes[numOfFoundNode] != null ){

			// 2. if foundNode.parent exist in parentNodes 
			//	  then swap foundNode and foundNode.parent IN 
	    	//	  	   parentNodes array
			//	  else change foundNode on	foundNode.parent  IN 
	    	//	  	   parentNodes array

			var ExistParentOfNodeInParentNodes = false;
			for ( var i = numOfFoundNode;
					  i >= 0;
					  i --)

				if (this.parentNodes[i] === node.parent){
					var tmp = this.parentNodes[i];
					this.parentNodes[i] = this.parentNodes[numOfFoundNode];
					this.parentNodes[numOfFoundNode] = tmp;
					ExistParentOfNodeInParentNodes = true;
					break;
				}

			if (!ExistParentOfNodeInParentNodes){
				this.parentNodes[numOfFoundNode] = node.parent;
			}

		}

		// If 'node' is a child of parent
		// then change value for the root on 'node'
			
		if ( this.root.left  === node ||
			this.root.right === node ){
			node.swapWithParent();
			this.root = node;
			this.root.parent = null;
		}
		else 
			node.swapWithParent();
		
		this.shiftNodeUp(node);		
	}


	shiftNodeDown(node) {
		if (node === null) return;
		
		let hasOnlyLeftChild =  (  (node.left !=  null)  && (node.right === null)),
			hasOnlyRightChild = (  (node.left === null)  && (node.right !=  null)),
			hasTwoChildren =    (  (node.left != null)   && (node.right !=  null)),
			withoutChildren =   (  (node.left ===  null) && (node.right === null));
			
		if (withoutChildren) { return; }
		
		if (hasTwoChildren) 
			if (node.priority >= node.right.priority &&
				node.priority >= node.left.priority)  return;

		if (hasOnlyLeftChild)
			if (node.priority >= node.left.priority)  return;
		
		if (hasOnlyRightChild)
			if (node.priority >= node.right.priority) return;
		
		// set parentNodes
		

		// use only after check that the childNode 
		// is left or right child
		function changeParentNodes(node,childNode,parentNodes){
			
			let foundNumOfNode = parentNodes.findIndex(function(element){ return element === node; }),
				foundNumOfChildNode = parentNodes.findIndex(function(element){ return element === childNode; });
			
			if ( foundNumOfChildNode != -1){
				var tmp = parentNodes[ foundNumOfNode ];
					parentNodes[foundNumOfNode] = parentNodes[ foundNumOfChildNode ];
					parentNodes[foundNumOfChildNode] = tmp;
			}else
				parentNodes[foundNumOfNode] = parentNodes[ foundNumOfChildNode ];
		}

		if ( hasTwoChildren ){
			let foundNumOfNode = -1;
			if (node.left.priority > node.right.priority) 
				foundNumOfNode = this.parentNodes.findIndex(function(element){ return element === node.left; });
			else 
				foundNumOfNode = this.parentNodes.findIndex(function(element){ return element === node.right; });
			if (foundNumOfNode != -1)
				this.parentNodes[foundNumOfNode] = node;
		}else
		if (hasOnlyLeftChild) {changeParentNodes(node,node.left,this.parentNodes);}
		else
		if (hasOnlyRightChild) {changeParentNodes(node,node.right,this.parentNodes);}
		 	
		

		// if the root is the node 	
		// then change root to node.parent
				
		let nodeWasRoot = (this.root === node);
		
		
		if (hasTwoChildren){
			if (node.left.priority > node.right.priority)
				node.left.swapWithParent();
			else
				node.right.swapWithParent();			
		}else
		if (hasOnlyLeftChild){  node.left.swapWithParent(); }
		else
		if (hasOnlyRightChild){ node.right.swapWithParent(); }	

		if ( nodeWasRoot )
			this.root = node.parent;

		this.shiftNodeDown(node);	
	}
}

module.exports = MaxHeap;
