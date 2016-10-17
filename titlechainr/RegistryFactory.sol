contract Node {
	string public name;
	mapping(string => address) children;
	address public parent;
	bool public isLeaf;
	address public titlechain;
	string public nodeType;

	function getChild(string val) returns (address) {
		return children[val];	
	}
  	function putChild(string val, address nodeAddress){
  		//create a new Node
		children[val] = nodeAddress;
	}
  	function setLeaf(address titlechainAddr){
  		isLeaf = true;
		titlechain = titlechainAddr;
	}
	function unsetLeaf(){
		isLeaf = false;	
	}
	function setName(string val){
		name = val;
	}
	function setType(string val){
		nodeType = val;
	}
}
contract NodeFactory {
	//creates nodes and returns the address
	function createNode(string val, string typeN) returns (address){
		Node n = new Node();
		n.unsetLeaf();
		n.setName(val);
		n.setType(typeN);
		return n;
	}
}
contract Registry is Node {
	string rootName;
		function setRoot(string name){
		rootName = name;	
	}
}
contract RegistryFactory {
  address lastCreated;
  address nodeFactory;
  function create() returns (address GSAddr) {
    lastCreated = new Registry();
    nodeFactory = new NodeFactory();
    return lastCreated;
  }
  function getLast() returns (address GSAddr) {
    return lastCreated;
  }
  function getNodeFactory() returns (address NFAddr) {
    return nodeFactory;
  }
}